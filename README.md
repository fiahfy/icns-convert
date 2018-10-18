# @fiahfy/icns-convert

> Convert PNG to [Apple Icon Image format](https://en.wikipedia.org/wiki/Apple_Icon_Image_format).

## Installation
```
npm install @fiahfy/icns-convert
```

## Usage
```js
import fs from 'fs'
import icnsConvert from '@fiahfy/icns-convert'

const buf = fs.readFileSync('input.png') // squre, 1024x1024 pixels or more
icnsConvert(buf).then((data) => {
  fs.writeFileSync('output.icns', data)
})
```

### Specify images by size
```js
const bufs = [
  fs.readFileSync('16x16.png'),
  fs.readFileSync('32x32.png'),
  fs.readFileSync('64x64.png'),
  fs.readFileSync('128x128.png'),
  fs.readFileSync('256x256.png'),
  fs.readFileSync('512x512.png'),
  fs.readFileSync('1024x1024.png')
]
icnsConvert(bufs).then((data) => {
  fs.writeFileSync('output.icns', data)
})
```

## CLI
```
icns-convert icon.png
```
