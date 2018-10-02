import fs from 'fs'
import path from 'path'
import program from 'commander'
import pkg from '../package.json'
import icnsConvert from '.'

const main = async () => {
  program
    .version(pkg.version)
    .description(pkg.description)
    .usage('[options] <source> <target>')
    .on('--help', () => {
      console.log(`
Examples:

  $ icns-convert input.png output.icns
  $ icns-convert inputs/ output.icns
`)
    })
    .parse(process.argv)

  const [source, target] = program.args

  if (!source || !target) {
    program.help()
  }

  const stat = fs.statSync(source)
  let arg
  if (stat.isDirectory()) {
    arg = fs.readdirSync(source).map((filename) => {
      return fs.readFileSync(path.join(source, filename))
    })
  } else {
    arg = fs.readFileSync(source)
  }
  const result = await icnsConvert(arg)
  fs.writeFileSync(target, result)
}

main().catch((e) => {
  console.error(e)
})
