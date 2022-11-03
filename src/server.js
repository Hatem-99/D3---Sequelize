import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import {
  badRequestErrorHandler,
  forbiddenErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandling.js"
import { pgConnect, syncModels } from "./db.js"
import cartsRouter from "./api/cart/index.js"


const server = express()
const port = 3001 


server.use(cors())
server.use(express.json())


server.use("/carts", cartsRouter)


server.use(badRequestErrorHandler)
server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErrorHandler)

await pgConnect()
await syncModels()

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is listening on port ${port}`)
})
