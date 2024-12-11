# hyllama

![hyllama](hyllama.jpg)

[![npm](https://img.shields.io/npm/v/hyllama)](https://www.npmjs.com/package/hyllama)
[![minzipped](https://img.shields.io/bundlephobia/minzip/hyllama)](https://www.npmjs.com/package/hyllama)
[![workflow status](https://github.com/hyparam/hyllama/actions/workflows/ci.yml/badge.svg)](https://github.com/hyparam/hyllama/actions)
[![mit license](https://img.shields.io/badge/License-MIT-orange.svg)](https://opensource.org/licenses/MIT)
![coverage](https://img.shields.io/badge/Coverage-100-darkred)
![dependencies](https://img.shields.io/badge/Dependencies-0-blueviolet)

Javascript parser for [llama.cpp](https://github.com/ggerganov/llama.cpp) gguf files.

This library makes it easy to parse metadata from GGUF files.

llama.cpp was originally an implementation of meta's llama model in C++, particularly on apple m-series chips.
But it has quickly evolved into a powerful tool for running various trained LLM models, on cpu or gpu.
The runtime has minimal dependencies and so is easy to deploy.
Model files are frequently distributed as .gguf files which contain all the info needed to run a model including architecture and weights.
[Hugging Face](https://huggingface.co/models?library=gguf) provides a great collection of serialized gguf model files, at varying levels of quantization.

Model files are often very large.
A goal of this library is to parse the file efficiently, without loading the entire file.

Dependency free since 2023!

## Installation

```bash
npm install hyllama
```

## Usage

### Node.js

If you're in a node.js environment, you can load a .gguf file with the following example:

```js
const { ggufMetadata } = await import('hyllama')
const fs = await import('fs')

// Read first 10mb of gguf file
const fd = fs.openSync('example.gguf', 'r')
const buffer = new Uint8Array(10_000_000)
fs.readSync(fd, buffer, 0, 10_000_000, 0)
fs.closeSync(fd)

// Parse metadata and tensor info
const { metadata, tensorInfos } = ggufMetadata(buffer.buffer)
```

### Browser

If you're in a browser environment, you'll probably get .gguf file data from either a drag-and-dropped file from the user, or downloaded from the web.

To load .gguf data in the browser from a remote `url`, it is recommended that you use an [HTTP range request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) to get just the first bytes:

```js
import { ggufMetadata } from 'hyllama'

const headers = new Headers({ Range: 'bytes=0-10000000' })
const res = await fetch(url, { headers })
const arrayBuffer = await res.arrayBuffer()
const { metadata, tensorInfos } = ggufMetadata(arrayBuffer)
```

To parse .gguf files from a user drag-and-drop action, see example in [index.html](index.html).

## File Size

Since .gguf files are typically very large, it is recommended that you only load the start of the file that contains the metadata.
How many bytes you need for the metadata depends on the gguf file.
In practice, most .gguf files have metadata that takes up a few megabytes.
If you get an error "RangeError: Offset is outside the bounds of the DataView" then you probably didn't fetch enough bytes.

## References

 - https://github.com/ggerganov/llama.cpp
 - https://github.com/ggerganov/ggml/blob/master/docs/gguf.md
 - https://huggingface.co/models?library=gguf

## Contributions

Contributions are welcome!

Hyparquet development is supported by an open-source grant from Hugging Face :hugs:
