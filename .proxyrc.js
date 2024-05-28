export default function(app) {
  app.use((req, res, next) => {
    res.setHeader('Timing-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
  })
}