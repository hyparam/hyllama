/**
 * Read llama.cpp GGUF metadata from a file
 *
 * @param {ArrayBuffer} arrayBuffer gguf file contents
 * @returns {Record<string, any>} metadata object
 */
export function ggufMetadata(arrayBuffer) {
  // DataView for easier manipulation of the buffer
  const view = new DataView(arrayBuffer)

  /**
   * Helper function to read string from DataView
   * @param {number} offset
   * @returns {{ string: string, newOffset: number }}
   */
  function readString(offset) {
    const length = view.getBigUint64(offset, true)
    let string = ''
    for (let i = 0; i < length; i++) {
      string += String.fromCharCode(view.getUint8(offset + 8 + i))
    }
    return { string, newOffset: offset + 8 + Number(length) }
  }

  /**
   * Helper function to read metadata value based on type
   *
   * Decoded is an object with newOffset and value properties
   *
   * @typedef {{ newOffset: number, value: any }} Decoded
   * @param {number} type
   * @param {number} offset
   * @returns {Decoded}
   */
  function readMetadataValue(type, offset) {
    switch (type) {
    case 0: // UINT8
      return { value: view.getUint8(offset), newOffset: offset + 1 }
    case 1: // INT8
      return { value: view.getInt8(offset), newOffset: offset + 1 }
    case 2: // UINT16
      return { value: view.getUint16(offset, true), newOffset: offset + 2 }
    case 3: // INT16
      return { value: view.getInt16(offset, true), newOffset: offset + 2 }
    case 4: // UINT32
      return { value: view.getUint32(offset, true), newOffset: offset + 4 }
    case 5: // INT32
      return { value: view.getInt32(offset, true), newOffset: offset + 4 }
    case 6: // FLOAT32
      return { value: view.getFloat32(offset, true), newOffset: offset + 4 }
    case 7: // BOOL
      return { value: view.getUint8(offset) !== 0, newOffset: offset + 1 }
    case 8: { // STRING
      const { string, newOffset } = readString(offset)
      return { value: string, newOffset }
    }
    case 9: { // ARRAY
      const arrayType = view.getUint32(offset, true)
      const arrayLength = view.getBigUint64(offset + 4, true)
      let arrayOffset = offset + 12
      const arrayValues = []
      for (let i = 0; i < arrayLength; i++) {
        const { value, newOffset } = readMetadataValue(arrayType, arrayOffset)
        arrayValues.push(value)
        arrayOffset = newOffset
      }
      return { value: arrayValues, newOffset: arrayOffset }
    }
    default:
      throw new Error('Unsupported metadata type: ' + type)
    }
  }

  // read the header
  const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))
  if (magic !== 'GGUF') throw new Error('Not a valid GGUF file')
  const version = view.getUint32(4, true)
  const tensorCount = view.getBigUint64(8, true)
  const metadataKVCount = view.getBigUint64(16, true)

  /** @type Record<string, any> */
  const metadata = {}
  metadata['version'] = version
  metadata['tensorCount'] = castNumber(tensorCount)

  // initial offset after header
  let offset = 24

  for (let i = 0; i < metadataKVCount; i++) {
    // read key
    const keyResult = readString(offset)
    offset = keyResult.newOffset

    // read value type
    const valueType = view.getUint32(offset, true)
    offset += 4

    // read value
    const valueResult = readMetadataValue(valueType, offset)
    offset = valueResult.newOffset

    metadata[keyResult.string] = valueResult.value
  }

  const tensorInfos = []

  for (let i = 0; i < tensorCount; i++) {
    // read tensor name
    const keyResult = readString(offset)
    offset = keyResult.newOffset

    const nDims = view.getUint32(offset, true)
    offset += 4

    /** @type bigint[] */
    const shape = []
    for (let dim = 0; dim < nDims; dim++) {
      shape.push(view.getBigUint64(offset, true))
      offset += 8
    }

    const type = view.getUint32(offset, true)
    offset += 4
    const tensorOffset = view.getBigUint64(offset, true)
    offset += 8

    tensorInfos.push({
      name: keyResult.string,
      nDims,
      shape,
      type,
      offset: tensorOffset,
    })
  }

  return { metadata, tensorInfos }
}

/**
 * Cast a bigint to a number, if it is safe to do so
 * @param {bigint} value
 * @returns {number | bigint}
 */
function castNumber(value) {
  return value > Number.MAX_SAFE_INTEGER ? value : Number(value)
}
