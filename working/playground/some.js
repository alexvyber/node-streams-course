const buffer = Buffer.alloc(5)
console.log(buffer)

buffer.fill("h", 0, 1)
buffer.fill("a", 1, 2)
console.log(buffer)

buffer.fill(0x3a, 2, 3)
console.log(buffer)

buffer.fill(0x29, 3, 4)
console.log(buffer)

console.log({ buffer })
console.log(buffer.toString())
