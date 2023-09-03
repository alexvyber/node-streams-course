import { it, describe, expect, vitest } from "vitest"
import { CSVToNDJSON } from "../src/stream-components/csv-to-ndjson"

const csvString = "id,name,phone\n22,Some,+7 (909) 123 32 -32\n"
const csvStringWithoutBreakline = "id,name,phone\n22,Some, +7 (909) 123 32 -32"

describe("CSV to JSON", () => {
  it("given a csv string it should return a ndjson string", () => {
    const csvToJSON = new CSVToNDJSON({
      delimeter: ",",
      headers: csvString.split("\n")[0].split(","),
    })

    const expected = JSON.parse(
      JSON.stringify({ id: "22", name: "Some", phone: "+7 (909) 123 32 -32" })
    )

    const fn = vitest.fn()
    csvToJSON.on("data", fn)
    csvToJSON.write(csvString)
    csvToJSON.end()

    const [current] = fn.mock.lastCall
    expect(JSON.parse(current)).toStrictEqual(expected)
  })

  it("it should work with strings that doesnt contains breaklines at the end", () => {
    const csvString = `id,name,address\n01,erick,address01`
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    })

    const expected = JSON.stringify({
      id: "01",
      name: "erick",
      address: "address01",
    })

    const fn = vitest.fn()
    csvToJSON.on("data", fn)
    csvToJSON.write(csvString)
    csvToJSON.end()

    const [current] = fn.mock.lastCall
    expect(JSON.parse(current)).toStrictEqual(JSON.parse(expected))
  })
  it("it should work with files that has breaklines in the begging in of the string", () => {
    const csvString = `\n\nid,name,address\n\n01,erick,address01\n02,ana,mystreet\n\n`
    const csvToJSON = new CSVToNDJSON({
      delimiter: ",",
      headers: ["id", "name", "address"],
    })

    const expected = [
      JSON.stringify({
        id: "01",
        name: "erick",
        address: "address01",
      }),

      JSON.stringify({
        id: "02",
        name: "ana",
        address: "mystreet",
      }),
    ]

    const fn = vitest.fn()
    csvToJSON.on("data", fn)
    csvToJSON.write(csvString)
    csvToJSON.end()

    const [firstCall] = fn.mock.calls[0]
    const [secondCall] = fn.mock.calls[1]

    expect(JSON.parse(firstCall)).toStrictEqual(JSON.parse(expected[0]))
    expect(JSON.parse(secondCall)).toStrictEqual(JSON.parse(expected[1]))
  })
})
