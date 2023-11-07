import { Router } from 'express'
import { readdirSync, statSync } from 'fs'
import path from 'path'
import notFoundRouter from './routers/home'
import { Auth, Cors, Permission } from './middleware'

const router = Router()

async function scan (folderPath: string, router: Router, prefix = ''): Promise<void> {
  try {
    const files = readdirSync(folderPath)

    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const stat = statSync(filePath)

      if (stat.isDirectory()) {
      // Se for um diretório, continue a recursão
        await scan(filePath, router, path.join(prefix, file))
      } else if (file.endsWith('.ts')) {
        // Importe o módulo de rota
        const { default: routeName } = await import(filePath)
        const fileFormat = file.replace('.ts', '')
        let route: string = path.join(prefix, fileFormat).split('\\').join('/')

        if (fileFormat === 'index') route = route.replace('index', '')
        if (fileFormat === 'find') route = route.replace('find', 'find/:id');


        ['get', 'post', 'delete', 'put'].forEach(async (method: string) => {
          if (routeName?.[method] !== undefined) {
            const middleware = []

            if (!routeName.notRequiresAuth) middleware.push(Auth)
            if (routeName.requereLevel) middleware.push(await Permission(routeName.requereLevel))
            if (!routeName.notRequiredCors) middleware.push(Cors)

            middleware.push(routeName[method])
            router[method](`/${route}`, middleware)
          }
        })
      }
    }
  } catch (err) {
    console.error(err)
  }
}

scan(path.join(__dirname, './routers'), router).then(() => {
  router.use('*', notFoundRouter.get)
})

export { router }
