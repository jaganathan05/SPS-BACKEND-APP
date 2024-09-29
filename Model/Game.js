const sequelize = require('../Database/database'); 
const Sequelize = require('sequelize');

const Game = sequelize.define('Game', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    gameId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    Player1Id :{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    Player1Name : {
        type: Sequelize.STRING,
        allowNull: true,
    },
    Player2Name:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    Player1Point:{
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    Player2Point:{
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    Player2Id :{
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    currentRound: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue : 1
    },
    TotalRounds: {
        type: Sequelize.INTEGER,
        defaultValue: 6
    },
    status: {
        type: Sequelize.STRING ,
        defaultValue: 'waiting'
    },
    finalwinner: {
        type: Sequelize.STRING,
        defaultValue: 'Null'
    }
});

module.exports = Game;