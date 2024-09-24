const Game = require('../Model/Game'); 
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.createGame = async (req, res) => {
    try {
        const userId = req.user._id; 
        const game = new Game({
            gameId: Math.random().toString(36).substring(7),
            players: [{ playerId: userId, playerName: req.user.name,  move: 'null' , point : 0}],
            currentRound : 1,
            rounds:[],
            status: 'waiting'
        });

        await game.save();
        return res.status(200).json({
            success: true,
            message: 'Game created successfully',
            gameId: game.gameId,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to create game', error });
    }
};


exports.joinGame = async (req, res) => {
    const { gameId} = req.body;
    const game = await Game.findOne({ gameId });
    const playerId  = req.user._id 
    const playerName = req.user.name

    if (game && game.players.length < 2) {
        game.players.push({ playerId, playerName, move: 'null' , point : 0 });
        if (game.players.length === 2) game.status = 'playing';
        await game.save();
        res.json({ message: 'Player joined', game });
    } else {
        res.json({ message: 'Game not found or full' });
    }
};

exports.submitMove = async (req, res) => {
    const { gameId, move } = req.body;
    const playerId = req.user._id;
    const game = await Game.findOne({ gameId });
    
    const player = game.players.find(p => p.playerId === playerId.toString());
    
    if (player) {
        player.move = move;
        await game.save();
        
        const opponent = game.players.find(p => p.playerId !== playerId.toString());
        if(!opponent){
            return res.json({ message : 'wait for opponent join'})
        }
        
        if (opponent.move === 'null' ) {
            return res.json({ message: `Wait for ${opponent.playerName}'s move` });
        } else {
            let winner = null;

          
            if (player.move === opponent.move) {
                winner = 'tie';
            } else if (
                (player.move === 'stone' && opponent.move === 'scissors') ||
                (player.move === 'scissors' && opponent.move === 'paper') ||
                (player.move === 'paper' && opponent.move === 'stone')
            ) {
                winner = player.playerName;
                player.point++;
            } else {
                winner = opponent.playerName;
                opponent.point++;
            }

           
            game.rounds.push({
                roundNumber: game.rounds.length + 1,
                player1Name: player.playerName,
                player1Move: player.move,
                player2Name: opponent.playerName,
                player2Move: opponent.move,
                winner: winner
            });

            player.move = 'null';
            opponent.move = 'null';

            if (game.currentRound <= game.TotalRounds) {
                game.currentRound++;
            }

            if (game.currentRound > game.TotalRounds) {
                game.status = 'finished';

                // final winner
                if (player.point > opponent.point) {
                    game.finalwinner = player.playerName;
                } else if (player.point < opponent.point) {
                    game.finalwinner = opponent.playerName;
                } else {
                    game.finalwinner = 'Tie';
                }
            }

            await game.save();
            return res.json({ message: `Move submitted. Round winner: ${winner}`, game });
        }
    }
};



exports.getGameState = async (req, res) => {
    const { gameId } = req.params;

    try {
        const game = await Game.findOne({ gameId });

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        return res.status(200).json({ success: true, game: game });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve game state', error });
    }
};


exports.FinishedGames =  async (req, res) => {
    try {
        const games = await Game.find({status : 'finished'}); 
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching games', error });
    }
};