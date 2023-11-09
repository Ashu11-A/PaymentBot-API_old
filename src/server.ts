import settings from './settings/settings.json'
import { App } from './app'
import http from 'http'

const { ip, port} = settings.express
const app = new App().server
const server = http.createServer(app)


server.listen(port, ip, () => {
  console.log(`Server is running in http://localhost:${port}`)
})
