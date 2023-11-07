import express from 'express'
import settings from './settings.json'
import { router } from './router'
import { Logging } from './middleware'
import helmet from 'helmet'

const { ip, port} = settings.express
const app = express()

app.use(helmet())
app.use(express.json())
app.use(Logging)
app.use(router)

app.listen(port, ip, () => {
  console.log(`Server is running in http://localhost:${port}`)
})
