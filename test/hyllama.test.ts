import { describe, expect, it } from 'vitest'
import { ggufMetadata } from '../src/hyllama'

describe('ggufMetadata function', () => {
  it('parses metadata correctly', () => {
    // In-memory gguf file
    const buffer = new ArrayBuffer(128)
    const view = new DataView(buffer)
    view.setUint8(0, 'G'.charCodeAt(0))
    view.setUint8(1, 'G'.charCodeAt(0))
    view.setUint8(2, 'U'.charCodeAt(0))
    view.setUint8(3, 'F'.charCodeAt(0))
    view.setUint32(4, 1, true) // version
    view.setBigUint64(8, BigInt(0), true) // tensorCount
    view.setBigUint64(16, BigInt(1), true) // metadataKVCount

    // Mock key-value pair
    const key = 'testKey'
    const value = 123
    // Write key
    view.setBigUint64(24, BigInt(key.length), true) // key length
    for (let i = 0; i < key.length; i++) {
      view.setUint8(32 + i, key.charCodeAt(i))
    }
    // Write value
    view.setUint32(32 + key.length, 4, true) // value type (UINT32)
    view.setUint32(36 + key.length, value, true) // value

    const metadata = ggufMetadata(buffer)

    // Assertions
    expect(metadata).toHaveProperty(key, value)
  })

  it('throws an error for non-GGUF file', () => {
    // Create a mock ArrayBuffer for a non-GGUF file
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    view.setUint8(0, 'A'.charCodeAt(0)) // Invalid magic number

    expect(() => ggufMetadata(buffer)).toThrow('Not a valid GGUF file')
  })
})
