# HyLlama Changelog

## [0.2.3]
 - Add aligned `dataOffset` to parsed metadata, pointing to the start of tensor data (#5)
 - Support big-endian GGUF v3 files
 - Throw on unsupported GGUF versions (only v2 and v3 are supported)
 - Decode GGUF strings as UTF-8 (#4)

## [0.2.2]
 - Support 64-bit integer and float metadata values

## [0.2.1]
 - Fix README example for files larger than 2gb

## [0.2.0]
 - Parse tensor infos

## [0.1.2]
 - Convert source to javascript with JSDoc types

## [0.1.1]
 - Return number instead of bigint when it is safe to do so
 - Add types to published package

## [0.1.0]
 - Parse GGUF metadata
