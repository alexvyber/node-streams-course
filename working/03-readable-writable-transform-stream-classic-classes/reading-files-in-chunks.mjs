// for i in `seq 1 20`; do node -e "process.stdout.write('hello world'.repeat(1e7))" >> big.file; done

import { promises, createReadStream, statSync } from "node:fs"

const filename = "./small.file"
// const filename = "./medium.file"
// const file = await promises.readFile(filename)
// console.log("🚀 ~ file Buffer:", file)
// console.log("🚀 ~ file Buffer:",  file)
// console.log("🚀 ~ typeof file:", typeof file)

// try {
//   const file = await promises.readFile(filename)
//   console.log('file size', file.byteLength / 1e9, "GB", "\n")
//   console.log('fileBuffer', file)
// } catch (error) {
//   console.log('error: max 2GB reached..', error.message)
// }

// const {
//   size
// } = statSync(filename)
// console.log('file size', size / 1e9, "GB", "\n")

// let chunkConsumed = 0;
// const stream = createReadStream(filename)
// // 65K per readable!
// // triggered by the first stream.read
// .once('data', msg => {
//   console.log('on data length', msg.toString().length)
// })
// .once('readable', _ => {
//   // this stream.read(11) will trigger the on(data) event
//   console.log('read 11 chunk bytes', stream.read(11).toString())
//   console.log('read 05 chunk bytes', stream.read(5).toString())

//   chunkConsumed += 11 + 5
// })
// .on('readable', _ => {
//   let chunk;
//   // stream.read() reads max 65Kbytes
//   while(null !== (chunk = stream.read())) {
//     chunkConsumed += chunk.length
//   }
// })
// .on('end', () => {
//   console.log(`Read ${chunkConsumed / 1e9} bytes of data...`)
// })

// try {
//   const file = await promises.readFile(filename)
//   const fileSize = (file.byteLength / 1024 ** 3).toFixed(2)
//   console.log("🚀 ~ file:", fileSize, "GB")
// } catch (error) {
// console.log("🚀 ~ error:", error)
// }

// console.log("🚀 ~ size:", size)

// fileSize(filename)
// console.log("🚀 ~ fileSize(filename):", fileSize(filename))

let index = 0

const stream = createReadStream(filename)
  // .once('data', msg => console.log('data length ', msg.toString().length))
  // .on('readable', data => {
  //   console.log("🚀 ~ data:", data)
  // })
  .on("data", () => index++)
  .once("readable", (_data) => {
    console.log(stream.read(12).toString() + stream.read(5).toString())
  })
  .on("end", () => console.log("🚀 ~ index:", index))

// --
function fileSize(filename) {
  return (statSync(filename).size / 1024 ** 3).toFixed(2) + " GB"
}
