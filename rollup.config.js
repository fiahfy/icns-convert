import babel from 'rollup-plugin-babel'
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
    external: ['@fiahfy/icns', 'fs', 'jimp'],
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
  },
  {
    input: 'src/cli.js',
    output: {
      file: pkg.bin['icns-convert'],
      format: 'cjs',
      banner: '#!/usr/bin/env node'
    },
    external: ['.', 'fs', 'path', 'commander'],
    plugins: [
      json(),
      babel({
        exclude: 'node_modules/**'
      })
    ]
  }
]
