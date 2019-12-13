import fs from 'fs'
import { convert } from '../src'

describe('icns convert', () => {
  test('should work', async () => {
    jest.setTimeout(30000)
    const buf = fs.readFileSync('./test/sample.png')
    const result = await convert(buf)
    expect(result).toBeTruthy()
  })

  test('should work with buffer array', async () => {
    jest.setTimeout(30000)
    console.warn = jest.fn()
    const bufs = [fs.readFileSync('./test/sample.png')]
    const result = await convert(bufs)
    expect(result).toBeTruthy()
  })

  test('should throw error', () => {
    const src = './test/sample.png' as any // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(convert(src)).rejects.toThrowError(TypeError)
  })
})
