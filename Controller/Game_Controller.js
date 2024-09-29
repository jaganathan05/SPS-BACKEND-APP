const Game = require('../Model/Game');
const Round = require('../Model/Round');
const sequelize = require('../Database/database')
require('dotenv').config();

exports.createGame = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const userId = req.user.id; 
        const game = await Game.create({
            gameId: Math.random().toString(36).substring(7),
            Player1Id: userId,
            Player1Name : req.user.Name,
            Player1Point : 0,
            currentRound: 1,
            status: 'waiting'
        }, { transaction: t });


        const round = await Round.create({
            roundNumber: game.currentRound,
            Player1Id: req.user.id,
            player1Name: req.user.name,
            player1Move: null,
            GameId: game.id,
            status : 'waiting'
        }, { transaction: t });

        

        await t.commit(); 
        return res.status(200).json({
            success: true,
            message: 'Game created successfully',
            gameId: game.gameId,
        });

    } catch (error) {
        await t.rollback(); 
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to create game', error });
    }
};




exports.joinGame = async (req, res) => {
    const t = await sequelize.transaction(); 
    try {
        const { gameId } = req.body;
        const game = await Game.findOne({ where: { gameId: gameId } }, { transaction: t });

        if (game) {

            if(game.status === 'finished'){
                return res.json({message : 'Game Finished ' , gameId : ''})
            }

            const updateGameStatus = await Game.update({
                status: 'playing',
                Player2Id: req.user.id ,
                Player2Name : req.user.Name,
                Player2Point : 0,
            }, {
                where: { id: game.id },
                transaction: t
            });

            const updateRound = await Round.update({
                Player2Id: req.user.id,
                player2Name: req.user.name,
                player2Move: null,
                status : 'playing'
            }, {
                where: { roundNumber: game.currentRound, GameId: game.id },
                transaction: t
            });

            await t.commit(); 
            return res.json({ message: 'Player Joined', gameId: game.gameId });

        } else {
            await t.rollback(); 
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

    } catch (err) {
        await t.rollback(); 
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};


exports.getGameState = async (req, res) => {
    const { gameId } = req.params;
    const t = await sequelize.transaction(); 

    try {
        const game = await Game.findOne({ where: { gameId: gameId } });
        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        const updatedRound = await Round.findOne({
            where: {
                GameId: game.id,
                roundNumber: game.currentRound
            }
        }, { transaction: t });

        if (updatedRound.player1Move && updatedRound.player2Move) {
            const player1Move = updatedRound.player1Move;
            const player2Move = updatedRound.player2Move;
            let winner = null;
            let player1Points = updatedRound.player1Point ;
            let player2Points = updatedRound.player2Point ;

            console.log('Player 1 Move:', player1Move);
            console.log('Player 2 Move:', player2Move);

            if (player1Move === player2Move) {
                winner = 'tie';
                await Round.update(
                    { winner: 'tie', status: 'finished' },
                    { where: { GameId: game.id, roundNumber: game.currentRound }, transaction: t }
                );
            } else if (
                (player1Move === 'stone' && player2Move === 'scissors') ||
                (player1Move === 'scissors' && player2Move === 'paper') ||
                (player1Move === 'paper' && player2Move === 'stone')
            ) {
                winner = updatedRound.player1Name;
                player1Points += 1;
                await Round.update(
                    { 
                        winner: updatedRound.player1Name, 
                        player1Point: player1Points, 
                        status: 'finished' 
                    },
                    { where: { GameId: game.id, roundNumber: game.currentRound }, transaction: t }
                );
            } else {
                winner = updatedRound.player2Name;
                player2Points +=1
                await Round.update(
                    { 
                        winner: updatedRound.player2Name, 
                        player2Point: player2Points, 
                        status: 'finished' 
                    },
                    { where: { GameId: game.id, roundNumber: game.currentRound }, transaction: t }
                );
            }

            if (game.currentRound < game.TotalRounds) {
                const newRoundNumber = game.currentRound + 1;

               
                await Round.create({
                    GameId: game.id,
                    roundNumber: newRoundNumber,
                    Player1Id: updatedRound.Player1Id,
                    Player2Id: updatedRound.Player2Id,
                    player1Move: null,
                    player2Move: null,
                    player1Point: player1Points,  
                    player2Point: player2Points,  
                    player1Name: updatedRound.player1Name,
                    player2Name: updatedRound.player2Name,
                    status: 'playing'
                }, { transaction: t });

             
                await Game.update(
                    { currentRound: newRoundNumber , Player1Name : updatedRound.player1Name , Player2Name : updatedRound.player2Name },
                    { where: { id: game.id }, transaction: t }
                );

            } else {
            
                await Game.update(
                    { status: 'finished' },
                    { where: { id: game.id }, transaction: t }
                );

              
                let finalWinner = 'Tie';
                if (player1Points > player2Points) {
                    finalWinner = updatedRound.player1Name;
                } else if (player1Points < player2Points) {
                    finalWinner = updatedRound.player2Name;
                }

                await Game.update(
                    { finalwinner: finalWinner  , Player1Point: player1Points , Player2Point : player2Points},
                    { where: { id: game.id }, transaction: t }
                );
            }

            await t.commit();
        } else {
            await t.commit(); 
        }


        const finishedgame = await Game.findOne({ where: { gameId: gameId }})
        const finishedRounds = await Round.findAll({ 
            where: { status: 'finished', GameId: game.id },
            order: [['roundNumber', 'DESC']]  
        });
        const playingRound = await Round.findOne({ where: { status: 'playing', GameId: game.id } });

        const gameState = {
            game: finishedgame,
            rounds: playingRound,
            finishedRounds: finishedRounds
        };
        return res.status(200).json({ success: true, Game: gameState });

    } catch (error) {
        await t.rollback(); 
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to retrieve game state', error });
    }
};



exports.submitMove = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { gameId, move } = req.body;
        const playerId = req.user.id;

       
        const game = await Game.findOne({ where: { gameId: gameId } }, { transaction: t });

    
        const selectedRound = await Round.findOne({
            where: {
                GameId: game.id,
                roundNumber: game.currentRound
            }
        }, { transaction: t });

        if (selectedRound.Player1Id === playerId) {
            await Round.update({
                player1Move: move
            }, {
                where: {
                    GameId: game.id,
                    roundNumber: game.currentRound
                },
                transaction: t
            });
        } else if (selectedRound.Player2Id === playerId) {
            await Round.update({
                player2Move: move
            }, {
                where: {
                    GameId: game.id,
                    roundNumber: game.currentRound
                },
                transaction: t
            });
        } else {
            await t.commit(); 
            return res.status(400).json({ success: false, message: 'Invalid player for this round.' });
        }

    
        const updatedRound = await Round.findOne({
            where: {
                GameId: game.id,
                roundNumber: game.currentRound
            }
        }, { transaction: t });

        if (updatedRound.player1Move && updatedRound.player2Move) {
       
            const { player1Move, player2Move } = updatedRound;
            let winner = null;

            if (player1Move === player2Move) {
                winner = 'tie';
            } else if (
                (player1Move === 'stone' && player2Move === 'scissors') ||
                (player1Move === 'scissors' && player2Move === 'paper') ||
                (player1Move === 'paper' && player2Move === 'stone')
            ) {
                winner = selectedRound.player1Name;
                await Round.update({
                    player1Point: updatedRound.player1Point + 1
                }, {
                    where: { GameId: game.id, roundNumber: game.currentRound },
                    transaction: t
                });
            } else {
                winner = selectedRound.player2Name;
                await Round.update({
                    player2Point: updatedRound.player2Point + 1
                }, {
                    where: { GameId: game.id, roundNumber: game.currentRound },
                    transaction: t
                });
            }

     
            await Round.update({
                winner: winner,
                status: 'finished'
            }, {
                where: { GameId: game.id, roundNumber: game.currentRound },
                transaction: t
            });

            await t.commit();

            return res.status(200).json({ 
                success: true, 
                message: 'Round finished', 
                result: { player1Move, player2Move, winner }
            });
        } else {
            await t.commit(); 

            return res.status(200).json({ 
                success: true, 
                message: 'Move submitted, waiting for other player.' 
            });
        }

    } catch (err) {
        await t.rollback(); 
        console.log(err);
        return res.status(500).json({ success: false, message: 'Failed to submit move', error: err });
    }
};










exports.FinishedGames =  async (req, res) => {
    try {
        const games = await Game.findAll({where:{ status : 'finished' }}); 
        return res.json({games});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching games', error });
    }
};