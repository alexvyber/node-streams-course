import net from "node:net"
import { PassThrough, Writable } from "node:stream"

import readline from "node:readline"
function log(msg) {
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(msg)
}

const output = Writable({
  write(chunk, enc, callback) {
    const { id, message } = JSON.parse(chunk)

    if (message) log(`reply from ${id}: ${message}`)
    else log(`my username: ${id}\n`)

    log(`type: `)
    callback(null, chunk)
  },
})

const resetChatAfterSent = PassThrough()
resetChatAfterSent.on("data", () => log('type: '))

process.stdin
  .pipe(resetChatAfterSent)
  .pipe(net.connect(3000))
  .pipe(output)
