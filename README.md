# hyllama

[![mit license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![workflow status](https://github.com/hyparam/hyllama/actions/workflows/ci.yml/badge.svg)](https://github.com/hyparam/hyllama/actions)
[![npm](https://img.shields.io/npm/v/hyllama)](https://www.npmjs.com/package/hyllama)

Parser for llama.cpp gguf files written in javascript.

This library makes it easy to parse metadata from GGUF files.

Model files are often very large.
A goal of this library is to parse the file efficiently, without loading the entire file into memory.

Dependency free since 2023.

## Usage

```bash
npm install hyllama
```

```js
import { ggufMetadata } from 'hyllama'

const metadata = ggufMetadata(arrayBuffer)
```
