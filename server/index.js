const http = require('http')
const app = require('express')()
const server = http.createServer(app)
const io = require('socket.io')(server)

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

io.on('connection', (socket) => {
  console.log('IO Connected')
})

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, () => {
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  })
}
start()
