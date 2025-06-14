/**
 * @module server
 * @description Express server to run Battlesnake
 * @requires express
 */

import express from 'express'

/**
 * @function runServer
 * @description Function to run the express server
 * @param {Object} handlers - Object containing the Battlesnake handlers
 */
export default function runServer(handlers) {
  const app = express()
  app.disable('x-powered-by')
  app.use(express.json())

  app.get('/', (req, res) => {
    res.send(handlers.info())
  })

  app.post('/start', (req, res) => {
    handlers.start(req.body)
    res.send('ok')
  })

  app.post('/move', (req, res) => {
    res.send(handlers.move(req.body))
  })

  app.post('/end', (req, res) => {
    handlers.end(req.body)
    res.send('ok')
  })

  app.use(function (req, res, next) {
    res.set('Server', 'battlesnake/replit/starter-snake-javascript')
    next()
  })

  const host = '0.0.0.0'
  const port = process.env.PORT || 8000

  app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`)
  })
}
