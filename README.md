# hyllama

![hyllama](hyllama.jpg)

[![mit license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![workflow status](https://github.com/hyparam/hyllama/actions/workflows/ci.yml/badge.svg)](https://github.com/hyparam/hyllama/actions)
[![npm](https://img.shields.io/npm/v/hyllama)](https://www.npmjs.com/package/hyllama)

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

## Usage

```bash
npm install hyllama
```

```js
import { ggufMetadata } from 'hyllama'

const metadata = ggufMetadata(arrayBuffer)
```

## References

 - https://github.com/ggerganov/llama.cpp
 - https://github.com/ggerganov/ggml/blob/master/docs/gguf.md
 - https://huggingface.co/TheBloke
