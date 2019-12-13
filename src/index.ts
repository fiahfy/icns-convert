import sharp from 'sharp'
import { Icns, IcnsImage } from '@fiahfy/icns'

const icnsConvertFromBuffer = async (buffer: Buffer): Promise<Buffer> => {
  const image = sharp(buffer)
  const { width, height } = await image.metadata()
  if (!width || !height || width !== height) {
    throw new TypeError('Image should be squre')
  }
  if (width < 1024 || height < 1024) {
    console.warn('Warning: Image should be 1024x1024 pixels or more')
  }

  const icns = new Icns()
  for (const { osType, size } of Icns.supportedIconTypes) {
    const cloned = image.clone().resize(size, size)
    const buf = await cloned.png().toBuffer()
    icns.append(IcnsImage.fromPNG(buf, osType))
  }

  return icns.data
}

const icnsConvertFromBuffers = async (buffers: Buffer[]): Promise<Buffer> => {
  const icns = new Icns()
  const sizes: number[] = []
  for (const buffer of buffers) {
    const image = sharp(buffer)
    const { width, height } = await image.metadata()
    if (!width || !height || width !== height) {
      throw new TypeError('Image should be squre')
    }

    const size = width
    const types = Icns.supportedIconTypes.filter(
      (type: { size: number }) => type.size === size
    )
    if (!types) {
      throw new TypeError(`Warning: No supported pixels (${size}x${size})`)
    }
    sizes.push(size)

    const buf = await image.png().toBuffer()
    for (const { osType } of types) {
      icns.append(IcnsImage.fromPNG(buf, osType))
    }
  }

  if (!sizes.length) {
    throw new TypeError('No valid images')
  }

  const missingSizes = Icns.supportedIconTypes
    .map((type) => type.size)
    .filter((size: number) => !sizes.includes(size))
  if (missingSizes.length) {
    const pixels = missingSizes
      .map((size: number) => `${size}x${size}`)
      .join(', ')
    console.warn(`Warning: Missing pixels (${pixels})`)
  }

  return icns.data
}

export const convert = async (buffer: Buffer | Buffer[]): Promise<Buffer> => {
  if (Buffer.isBuffer(buffer)) {
    return icnsConvertFromBuffer(buffer)
  } else if (Array.isArray(buffer)) {
    return icnsConvertFromBuffers(buffer)
  } else {
    throw new TypeError('Image must be Buffer or Buffer Array')
  }
}
