import readline from "node:readline"
export function log(message) {
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(message)
}
