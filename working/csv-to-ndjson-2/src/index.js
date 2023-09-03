// done

/*
echo "id,name,desc,age" > big.csv
for i in `seq 1 5`; do node -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e5))" >> big.csv; done # 500K items
for i in `seq 1 5`; do node -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e6))" >> big.csv; done # 5M items
for i in `seq 1 5`; do node -e "process.stdout.write('$i,erick-$i,$i-text,$i\n'.repeat(1e7))" >> big.csv; done  #50M items
*/

import { statSync, createReadStream, createWriteStream } from "node:fs"
import { Transform } from "node:stream"
import { pipeline } from "node:stream/promises"

import { CSVToNDJSON } from "./stream-components/csv-to-ndjson.js"
import { Reporter } from "./stream-components/reporter.js"
import { log } from "./util.js"

const filename = "big.csv"

const { size: fileSize } = statSync(filename)

let counter = 0

const processData = Transform({
  transform(chunk, enc, callback) {
    const data = JSON.parse(chunk)
    const result = JSON.stringify({
      ...data,
      id: counter++,
    }).concat("\n")

    return callback(null, result)
  },
})
const csvToJSON = new CSVToNDJSON({
  delimiter: ",",
  headers: ["id", "name", "desc", "age"],
})

const startedAt = Date.now()

await pipeline(
  createReadStream(filename),
  csvToJSON,
  processData,
  new Reporter().progress(fileSize),
  createWriteStream("big.ndjson")
)

const timeInSeconds = Math.round((Date.now() - startedAt) / 1000).toFixed(2)
const finalTime = timeInSeconds > 1000 ? `${timeInSeconds / 60}m` : `${timeInSeconds}s`
log(`took: ${finalTime} - processed items ${counter} - process finished with success!`)
