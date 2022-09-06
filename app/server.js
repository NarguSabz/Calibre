const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/about', (req, res) => {
    res.render('pages/about')
  })

app.listen(port, () => {
  console.log(`Server's on localhost:${port}`)
})