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
import productsRouter from "./api/products/index.js"
import categoriesRouter from "./api/categories/index.js"
import reviewsRouter from "./api/reviews/index.js"
import usersRouter from "./api/users/index.js"


const server = express()
const port = 3001 


server.use(cors())
server.use(express.json())


server.use("/products", productsRouter)
server.use("/categories", categoriesRouter)
server.use("/reviews", reviewsRouter)
server.use("/users", usersRouter)

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
