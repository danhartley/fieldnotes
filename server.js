const express = require("express")
const path = require('path')
const router = express.Router()
const app = express()
const port = 3000

app.get('/', function (req, res) {
  res.send('Hello Small World!')
})

// app.use(express.static(__dirname))
app.use(express.static(__dirname + '/public'))

router.get('/fieldnotes', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-read.html'))
})

router.get('/inaturalist', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-read.html'))
})

router.get('/preferences', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-read.html'))
})

router.get('/fieldnotes-create', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-write.html'))
})

router.get('/fieldnotes-edit', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-write.html'))
})

router.get('/fieldnotes-preferences', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/ui-write.html'))
})

app.use('/', router)
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`)
})
