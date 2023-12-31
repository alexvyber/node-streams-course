import { createServer } from "node:http"
import { createReadStream } from "node:fs"
import { Readable, Transform } from "node:stream"
import { WritableStream, TransformStream } from "node:stream/web"
import { setTimeout } from "node:timers/promises"
import csvtojson from "csvtojson"

const PORT = 3000

createServer(async (req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, headers)
    res.end()
    return
  }

  console.log(req)
  const abortController = new AbortController()

  let items = 0
  req.on("close", () => console.log("connection closed ", items, " transfered"))
  try {
    res.writeHead(200, headers)

    Readable.toWeb(createReadStream("./animeflv.csv"))
      .pipeThrough(Transform.toWeb(csvtojson()))
      .pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            const data = JSON.parse(Buffer.from(chunk))
            const mappedData = JSON.stringify({
              title: data.title,
              description: data.description,
              url: data.url_anime,
            })
            // console.log(mappedData)
            controller.enqueue(mappedData.concat("\n"))
          },
        })
      )
      .pipeTo(
        new WritableStream({
          async write(chunk) {
            // await setTimeout(500)
            items++
            res.write(chunk)
          },

          abort(reason) {
            console.log(reason)
          },
          close() {
            res.end()
          },
        }),

        {
          signal: abortController.signal,
        }
      )
  } catch (error) {
    console.error(error)
  }
})
  .listen(PORT)
  .on("listening", () => console.log(`Listenning on the http://localhost:${PORT}`))

// createServer(async (request, response) => {
//   const headers = {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Methods": "*",
//   }

//   if (request.method === "OPTIONS") {
//     response.writeHead(204, headers)
//     response.end()
//     return
//   }

//   let items = 0

//   const abortController = new AbortController()
//   request.once("close", async () => {
//     console.log(`connection was closed! ${items} processed...`)
//     abortController.abort()
//   })

//   try {
//     response.writeHead(200, headers)

//     await Readable.toWeb(createReadStream("./animeflv.csv"))
//       .pipeThrough(Transform.toWeb(csvtojson()))
//       .pipeThrough(
//         new TransformStream({
//           transform(chunk, controller) {
//             const data = JSON.parse(Buffer.from(chunk))
//             const mappedData = JSON.stringify({
//               title: data.title,
//               description: data.description,
//               url: data.url_anime,
//             })

//             controller.enqueue(mappedData.concat("\n"))
//           },
//         })
//       )
//       .pipeTo(
//         new WritableStream({
//           async write(chunk) {
//             // await setTimeout(200)
//             items++
//             response.write(chunk)
//           },
//           abort(reason) {
//             // console.log('aborted***', reason)
//           },
//           close() {
//             response.end()
//           },
//         }),
//         {
//           signal: abortController.signal,
//         }
//       )
//   } catch (error) {
//     if (!error.message.includes("abort")) throw error
//   }
// })
//   .listen(3000)
//   .on("listening", (_) => console.log("application is running at", PORT))
