# hyllama

![hyllama](hyllama.jpg)

[![npm](https://img.shields.io/npm/v/hyllama)](https://www.npmjs.com/package/hyllama)
[![workflow status](https://github.com/hyparam/hyllama/actions/workflows/ci.yml/badge.svg)](https://github.com/hyparam/hyllama/actions)
[![mit license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![dependencies](https://img.shields.io/badge/Dependencies-0-blueviolet)

Javascript parser for [llama.cpp](https://github.com/ggerganov/llama.cpp) gguf files.

This library makes it easy to parse metadata from GGUF files.

llama.cpp was originally an implementation of meta's llama model in C++, particularly on apple m-series chips.
But it has quickly evolved into a powerful tool for running various trained LLM models, on cpu or gpu.
The runtime has minimal dependencies and so is easy to deploy.
Model files are frequently distributed as .gguf files which contain all the info needed to run a model including architecture and weights.
[TheBloke](https://huggingface.co/TheBloke) provides a great collection of serialized gguf model files, at varying levels of quantization.

Model files are often very large.
A goal of this library is to parse the file efficiently, without loading the entire file into memory.

Dependency free since 2023!

## Installation

```bash
npm install hyllama
```

## Usage

If you're in a node.js environment, you can load a .gguf file with the following example:

```js
const { ggufMetadata } = await import('hyllama')
const fs = await import('fs')

const buffer = fs.readFileSync('example.gguf')
const arrayBuffer = new Uint8Array(buffer).buffer
const { metadata, tensorInfos } = ggufMetadata(arrayBuffer)
```

If you're in a browser environment, you'll probably get .gguf file data from either a drag-and-dropped file from the user, or downloaded from the web.

To load .gguf data in the browser from a remote server using `fetch`:

```js
import { ggufMetadata } from 'hyllama'

const res = await fetch(url)
const arrayBuffer = await res.arrayBuffer()
const { metadata, tensorInfos } = ggufMetadata(arrayBuffer)
```

To parse .gguf files from a user drag-and-drop action, see example in [index.html](index.html).

## References

 - https://github.com/ggerganov/llama.cpp
 - https://github.com/ggerganov/ggml/blob/master/docs/gguf.md
 - https://huggingface.co/TheBloke
