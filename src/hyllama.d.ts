/**
 * Read llama.cpp GGUF metadata from a file
 *
 * @param arrayBuffer gguf file contents
 * @returns metadata object
 */
export declare function ggufMetadata(arrayBuffer: ArrayBuffer): {
  metadata: Record<string, any>
  tensorInfos: {
    name: string
    nDims: number
    shape: bigint[]
    type: number
    offset: bigint
  }[]
}
