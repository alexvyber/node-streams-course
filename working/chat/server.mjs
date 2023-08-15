import { randomUUID } from "node:crypto"
import net from "node:net"
import { Writable } from "node:stream"

const users = new Map()

function notifySubscribers(socketId, data) {
  for (const userSocket of users.values()) {
    if (userSocket.id !== socketId) {
      userSocket.write(data)
    }
  }
}

function braodcaster(socket) {
  return Writable({
    write(chunk, _, fn) {
      const data = JSON.stringify({
        message: chunk.toString(),
        id: socket.id.slice(0, 4),
      })
      notifySubscribers(socket.id, data)

      fn(null, chunk)
    },
  })
}

const server = net.createServer((socket) => {
  socket.pipe(braodcaster(socket))
})

server.on("connection", (socket) => {
  socket.id = randomUUID()

  console.log("new connection", socket.id)
  users.set(socket.id, socket)

  socket.write(
    JSON.stringify({
      id: socket.id.slice(0, 4),
    })
  )

  socket.on("close", () => {
    console.log("disconnected", socket.id)
    users.delete(socket.id)
  })
})

server.listen(3000, () => console.log("server is listening"))
