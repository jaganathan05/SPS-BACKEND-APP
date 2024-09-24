const express = require('express');
const router = express.Router();
const gameController = require('../Controller/Game_Controller');
const authentication = require('../Middleware/Auth')


router.post('/create', authentication, gameController.createGame);
router.post('/join', authentication, gameController.joinGame);
router.post('/move', authentication, gameController.submitMove);
router.get('/game/:gameId', gameController.getGameState); 
router.get('/games',gameController.FinishedGames)

module.exports = router;
