const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const firebaseRoute = require('./routes/firebaseRoute')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())
app.use("/api/firebase", firebaseRoute)

app.listen(port, () => console.log(` app listening on port ${port}!`))