import fs from 'fs'
import icnsConvert from '../src'

describe('icns convert', () => {
  test('should work', async () => {
    jest.setTimeout(30000)
    const buf = fs.readFileSync('./test/sample.png')
    const result = await icnsConvert(buf)
    expect(result).toBeTruthy()
  })

  test('should work with buffer array', async () => {
    jest.setTimeout(30000)
    console.warn = jest.fn()
    const bufs = [fs.readFileSync('./test/sample.png')]
    const result = await icnsConvert(bufs)
    expect(result).toBeTruthy()
  })

  test('should throw error', () => {
    const src = './test/sample.png'
    expect(icnsConvert(src)).rejects.toThrowError(TypeError)
  })
})
