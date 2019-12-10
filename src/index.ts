import Jimp from 'jimp'

const Icns = require('@fiahfy/icns') // eslint-disable-line @typescript-eslint/no-var-requires

const icnsConvertFromBuffer = async (buffer: Buffer): Promise<Buffer> => {
  const image = await Jimp.read(buffer)
  if (image.getMIME() !== Jimp.MIME_PNG) {
    throw new TypeError('Image must be png format')
  }
  if (image.getWidth() !== image.getHeight()) {
    throw new TypeError('Image should be squre')
  }
  if (image.getWidth() < 1024 || image.getHeight() < 1024) {
    console.warn('Warning: Image should be 1024x1024 pixels or more')
  }

  const icns = new Icns()
  for (const { osType, size } of Icns.supportedTypes) {
    const img = image.clone().resize(size, size)
    const buf = await img.getBufferAsync(Jimp.MIME_PNG)
    await icns.appendImage(buf, osType)
  }

  return icns.data
}

const icnsConvertFromBuffers = async (buffers: Buffer[]): Promise<Buffer> => {
  const icns = new Icns()
  const sizes: number[] = []
  for (const buffer of buffers) {
    const image = await Jimp.read(buffer)
    if (image.getMIME() !== Jimp.MIME_PNG) {
      throw new TypeError('Image must be png format')
    }
    if (image.getWidth() !== image.getHeight()) {
      throw new TypeError('Image must be squre')
    }

    const size = image.getWidth()
    const types = Icns.supportedTypes.filter(
      (type: { size: number }) => type.size === size
    )
    if (!types) {
      throw new TypeError(`Warning: No supported pixels (${size}x${size})`)
    }
    sizes.push(size)

    const buf = await image.getBufferAsync(Jimp.MIME_PNG)
    for (const { osType } of types) {
      await icns.appendImage(buf, osType)
    }
  }

  if (!sizes.length) {
    throw new TypeError('No valid images')
  }

  const missingSizes = Icns.supportedSizes.filter(
    (size: number) => !sizes.includes(size)
  )
  if (missingSizes.length) {
    const pixels = missingSizes
      .map((size: number) => `${size}x${size}`)
      .join(', ')
    console.warn(`Warning: Missing pixels (${pixels})`)
  }

  return icns.data
}

export default async (buffer: Buffer | Buffer[]): Promise<Buffer> => {
  if (Buffer.isBuffer(buffer)) {
    return icnsConvertFromBuffer(buffer)
  } else if (Array.isArray(buffer)) {
    return icnsConvertFromBuffers(buffer)
  } else {
    throw new TypeError('Image must be Buffer or Buffer Array')
  }
}
