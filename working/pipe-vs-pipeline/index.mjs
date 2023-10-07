import { createServer } from "node:http"
import { createReadStream } from "node:fs"
import { pipeline } from "node:stream/promises"

const file = createReadStream("./big.file")
const file2 = createReadStream("./big.file")

createServer((req, res) => {
  file.pipe(res)
}).listen(3000, () => console.log("started"))

createServer(async (req, res) => {
  file.pipe(res)
  await pipeline(file2, res)
}).listen(3001, () => console.log("started"))
