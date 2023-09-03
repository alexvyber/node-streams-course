import { Transform } from "node:stream"
const BREAK = "\n"
const NOT_FOUND = -1

export class CSVToNDJSON extends Transform {
  #delimiter = ""
  #headers = []
  #buffer = Buffer.alloc(0)

  constructor({ delimeter = ",", headers }) {
    super()

    this.#delimiter = delimeter
    this.#headers = headers
  }

  *#updateBuffer(chunk) {
    // const arr  = new Uint8Array(2)
    // arr.set([chu])
    // arr.
    this.#buffer = Buffer.concat([this.#buffer, chunk])
    let breaklineIndex = 0
    while (breaklineIndex !== NOT_FOUND) {
      breaklineIndex = this.#buffer.indexOf(Buffer.from(BREAK))
      if (breaklineIndex === NOT_FOUND) break

      const lineDataIndex = breaklineIndex + BREAK.length
      const line = this.#buffer.subarray(0, lineDataIndex)
      const lineData = line.toString()

      this.#buffer = this.#buffer.subarray(lineDataIndex)
      if (lineData === BREAK) continue

      const NDJSONLine = []
      const headers = Array.from(this.#headers)

      for (const item of lineData.split(this.#delimiter)) {
        const key = headers.shift()
        const value = item.replace(BREAK, "")

        if (key === value) break

        NDJSONLine.push(`"${key}" : "${value}"`)
      }

      if (!NDJSONLine.length) continue
      const ndJSONData = NDJSONLine.join(",")

      yield Buffer.from("{".concat(ndJSONData).concat("}").concat(BREAK))
    }
  }

  _transform(chunk, enc, callback) {
    for (const item of this.#updateBuffer(chunk)) {
      this.push(item)
    }

    return callback()
  }

  _final(callback) {
    if (!this.#buffer.length) return callback()

    for (const item of this.#updateBuffer(Buffer.from(BREAK))) {
      this.push(item)
    }

    callback()
  }
}
