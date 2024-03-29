import { describe, expect, it } from 'vitest'
import { ggufMetadata } from '../src/hyllama.js'

const URL_LLAMA = 'https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q2_K.gguf'

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

    const { metadata } = ggufMetadata(buffer)

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

  it('parses metadata and tensor info from remote file', async () => {
    const buf = await (
      await fetch(URL_LLAMA, {
        headers: {
          Range: 'bytes=0-999999',
        },
      })
    ).arrayBuffer()

    const { metadata, tensorInfos } = ggufMetadata(buf)

    expect(metadata).toMatchObject({
      version: 2,
      tensorCount: 291,
      'general.architecture': 'llama',
      'general.file_type': 10,
      'general.name': 'LLaMA v2',
      'general.quantization_version': 2,
      'llama.attention.head_count': 32,
      'llama.attention.head_count_kv': 32,
      'llama.attention.layer_norm_rms_epsilon': 9.999999974752427e-7,
      'llama.block_count': 32,
      'llama.context_length': 4096,
      'llama.embedding_length': 4096,
      'llama.feed_forward_length': 11008,
      'llama.rope.dimension_count': 128,
    })

    expect(tensorInfos.length).toEqual(291)
    expect(tensorInfos[0]).toMatchObject({
      name: 'token_embd.weight',
      shape: [4096n, 32000n],
      type: 10,
    })
    expect(tensorInfos[tensorInfos.length - 1]).toMatchObject({
      name: 'output_norm.weight',
      shape: [4096n],
      type: 0,
    })
  })
})
