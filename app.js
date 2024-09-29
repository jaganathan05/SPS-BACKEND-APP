const Express = require('express')
const app = Express();
const cors = require('cors')
const userrouter =  require('./Routes/User_routes')
const Gameroutes = require('./Routes/Game_routes')

//Models 
const User = require('./Model/User')
const Game = require('./Model/Game')

const Rounds = require('./Model/Round')


//Relationship b/w Tables 

User.hasMany(Game)
Game.belongsTo(User) 

Game.hasMany(Rounds)
Rounds.belongsTo(Game)



app.use(cors())
app.use(Express.json())
app.use(userrouter)
app.use(Gameroutes)
require('dotenv').config();
const sequelize = require('./Database/database')

sequelize.sync().then(()=>{
    app.listen(4000)
    console.log('synced')
})
