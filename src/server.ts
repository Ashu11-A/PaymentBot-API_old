import express from 'express'
import settings from './settings/settings.json'
import { router } from './router'
import { Logging, LoggingErrors, clientErrorHandler, errorHandler } from './middleware'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import methodOverride  from 'method-override'

const { ip, port} = settings.express
const app = express()

app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(Logging)
app.use(router)
app.use(LoggingErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

app.listen(port, ip, () => {
  console.log(`Server is running in http://localhost:${port}`)
})
