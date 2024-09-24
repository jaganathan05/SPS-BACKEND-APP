const Express = require('express')
const mongoose = require('mongoose')
const app = Express();
const cors = require('cors')
const userrouter =  require('./Routes/User_routes')
const Gameroutes = require('./Routes/Game_routes')

app.use(cors())
app.use(Express.json())
app.use(userrouter)
app.use(Gameroutes)
require('dotenv').config();

mongoose.connect(process.env.mongo_db_connection).then(res=>{
    app.listen(4000)
    console.log('connected')
})

