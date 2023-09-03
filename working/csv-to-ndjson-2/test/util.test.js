import { expect, describe, afterAll, test, vitest } from "vitest"
import { log } from "../src/util.js"
import readline from "node:readline"

describe("Log Suite Test", () => {
  readline.cursorTo = vitest.fn().mockImplementation()
  process.stdout.write = vitest.fn().mockImplementation()

  test("writeInput", () => {
    const msg = "test"

    log(msg)

    expect(readline.cursorTo).toBeCalledWith(process.stdout, 0)
    expect(process.stdout.write).toBeCalledWith(msg)
  })

  afterAll(() => vitest.clearAllMocks())
})
