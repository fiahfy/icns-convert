import json from 'rollup-plugin-json'
import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'esm'
      }
    ],
    external: ['fs', 'jimp', '@fiahfy/packbits']
  },
  {
    input: 'src/cli.js',
    output: {
      file: pkg.bin['icns-convert'],
      format: 'cjs',
      banner: '#!/usr/bin/env node'
    },
    external: ['.', 'fs', 'path', 'commander'],
    plugins: [json()]
  }
]
