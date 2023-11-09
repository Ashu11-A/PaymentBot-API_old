import express, { Application } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { router } from './router'
import methodOverride  from 'method-override'
import Logging from './middleware/Logging'
import Errors from './middleware/Error'
import Ratelimit from './middleware/RateLimit'

export class App {
  public server: Application

  constructor() {
    this.server = express()
    this.middleware()
    this.router()
  }

  private middleware (): void {
    this.server.use(Ratelimit())
    this.server.use(helmet())
    this.server.use(express.json())
    this.server.use(bodyParser.urlencoded({ extended: true }))
    this.server.use(bodyParser.json())
    this.server.use(methodOverride())
    this.server.use(Logging())
  }

  private router (): void {
    this.server.use(router)
    this.server.use(Errors())
  }
}
