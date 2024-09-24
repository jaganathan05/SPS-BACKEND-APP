const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    gameId: {
        type: String,
        required: true,
        unique: true,
        
    },
    players: [{
        playerId: {
            type: String,
            required: true,
            
        },
        playerName: {
            type: String,
            required: true,
            
        },
        move:{
            type: String,
            required : true,
           
        },
        point : {
            type: Number ,
            required : true
        }
        
    }],
    currentRound : {
        type : Number,
        required : true
    },
    TotalRounds : {
        type : Number,
        default : 6
    },
    rounds: [{
        roundNumber: {
            type: Number,
            required: true
        },
        player1Name:{
            type: String
        },
        player1Move: {
            type: String,
            enum: ['stone', 'paper', 'scissors'], 
            required: true
        },
        player2Name:{
            type: String
        },
        player2Move: {
            type: String,
            enum: ['stone', 'paper', 'scissors'], 
            required: true
        },
        winner: {
            type: String,
            required: true
        }
    }],

    status: {
        type: String,
        enum: ['waiting', 'playing', 'finished'], 
        default: 'waiting' 
    },
    finalwinner : {
        type: String,
        required : true,
        default: 'Null'
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }
});



module.exports = mongoose.model('Game', gameSchema);
