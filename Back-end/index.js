const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const firebaseRoute = require('./routes/firebaseRoute')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.options("*",cors({
  origin: "https://clipnest-zeta.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}))
app.use("/api/firebase", firebaseRoute)

app.listen(port, () => console.log(` app listening on port ${port}!`))