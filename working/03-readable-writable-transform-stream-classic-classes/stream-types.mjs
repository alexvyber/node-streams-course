import { Readable, Writable, Transform } from "node:stream"
import { randomUUID } from "node:crypto"

import { createWriteStream } from "node:fs"

// data source: file, database, website, anything you can consume on demand!
// const readable = Readable({
//   read() {
//     //  1.000.000
//     for (let index = 0; index < 1e6; index++) {

//       const person = {
//         id: randomUUID(),
//         name: `Erick-${index}`
//       }

//       const data = JSON.stringify(person)

//       this.push(data)
//     }

//     // notify that the data is empty (consumed everything)
//     this.push(null)
//   }
// })

// const mapFields = Transform({
//   transform(chunk, enc, cb) {
//     const data = JSON.parse(chunk)
//     const result = `${data.id},${data.name.toUpperCase()}\n`
//     cb(null, result)
//   }
// })

// const mapHeaders = Transform({
//   transform(chunk, enc, cb) {
//     this.counter = this.counter ?? 0;
//     if (this.counter) {
//       return cb(null, chunk)
//     }
//     this.counter += 1;
//     cb(null, 'id,name\n'.concat(chunk))
//   }
// })

// const pipeline = readable
//   .pipe(mapFields)
//   .pipe(mapHeaders)
//   .pipe(createWriteStream('my.csv'))

// pipeline
//   .on('end', () => console.log('task finished...'))
// writable is always the output -> print smth, save, ignore, send email, send to other stream.
// .pipe(process.stdout)

// --
// Readable({
//   read() {
//     this.push("some" + Math.random())
//     this.push("some" + Math.random())
//     this.push("some" + Math.random())
//     this.push("some" + Math.random())

//     this.push(null)
//   }
// }).on("data", data => console.log(data.toString()))

// Readable({
//   read() {
//     for (let index = 0; index < 1000; index++) {
//       const person = { id: randomUUID(), name: "some " + (index + 1)}
//       this.push(JSON.stringify(person))
//     }

//     this.push(null)
//   }
// }).on("data", data => console.log(data.toString()))

const readable = Readable({
  read() {
    for (let index = 0; index < 10_000_000; index++) {
      const person = { id: randomUUID(), name: "some " + (index + 1) }
      this.push(JSON.stringify(person))
    }

    this.push(null)
  },
})

const mapHeaders = Transform({
  transform(chunk, _encoding, callback) {
    this.flag = this.flag ?? true

    if (this.flag) {
      callback(null, "id,name\n" + chunk)
      this.flag = false
      return
    }

    callback(null, chunk)
  },
})

const mapFields = Transform({
  transform(chunk, _encoding, callback) {
    const data = JSON.parse(chunk)
    const res = `${data.id},${data.name.toUpperCase()}\n`
    callback(null, res)
  },
})

const pipeline = readable.pipe(mapFields).pipe(mapHeaders).pipe(createWriteStream("my.csv"))
// .pipe(process.stdout)
