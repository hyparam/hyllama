# hyllama

Parser for llama.cpp gguf files written in javascript.

This library makes it easy to parse metadata from GGUF files.

Model files are often very large.
A goal of this library is to parse the file efficiently, without loading the entire file into memory.

## Usage

```bash
npm install hyllama
```

```js
import { ggufMetadata } from 'hyllama'

const metadata = ggufMetadata(arrayBuffer)
```
