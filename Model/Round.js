const sequelize = require('../Database/database'); 
const Sequelize = require('sequelize');

const Round = sequelize.define('Round', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    roundNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    Player1Id:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    player1Name: {
        type: Sequelize.STRING
    },
    player1Move: {
        type: Sequelize.STRING,
        allowNull: true
    },
    player1Point:{
        type: Sequelize.INTEGER,
        allowNull : false ,
        defaultValue : 0
    },
    Player2Id:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    player2Name: {
        type: Sequelize.STRING
    },
    player2Move: {
        type: Sequelize.STRING,
        allowNull: true
    },
    player2Point:{
        type: Sequelize.INTEGER,
        allowNull : false ,
        defaultValue : 0
    },
    status:{
        type: Sequelize.STRING ,
        allowNull : false
    },
    winner: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

module.exports=Round