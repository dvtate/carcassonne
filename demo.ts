import Game from './lib/Game';
import Player from './lib/Player';

/*
 * This file is just to give an idea of how one might implement a game using this library
 */

// TODO implement
const ui: any = {
    getPlayers: () => [ new Player(), new Player()],
};

// Create game
const game = new Game(ui.getPlayers());

// Game turn loop
while (!game.over()) {
    // Make user select placement option
    ui.displayTileOptions(game.turn.placementOptions);
    const option = ui.getUserInput(game.turn.player);
    const placement = game.turn.placementOptions[option];

    // Prompt followers
    if (ui.askIfTheyWantToAddFollower()) {
        const option = ui.displayFollowerOptions(placement.getFollowerOptions());
        placement.setFollower(placement.getFollowerOptions()[option]);
    }

    // Execute turn
    game.turn.act(placement);
}

// TODO
// ui.displayScore(game.calculateScore());