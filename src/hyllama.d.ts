/**
 * Read llama.cpp GGUF metadata from a file
 *
 * @param arrayBuffer gguf file contents
 * @returns metadata object
 */
export declare function ggufMetadata(arrayBuffer: ArrayBuffer): {
  metadata: Record<string, any>
  /** File offset of tensor data, or end of metadata when there are no tensors. */
  dataOffset: number
  tensorInfos: {
    name: string
    nDims: number
    shape: bigint[]
    type: number
    offset: bigint
  }[]
}
