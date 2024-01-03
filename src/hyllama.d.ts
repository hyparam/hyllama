/**
 * Read llama.cpp GGUF metadata from a file
 *
 * @param arrayBuffer gguf file contents
 * @returns metadata object
 */
export declare function ggufMetadata(arrayBuffer: ArrayBuffer): Record<string, any>
