import Game from './lib/Game';
import Player from './lib/Player';
import { PlaceTileAction } from './lib/GameAction';
import Follower from './lib/Follower';

/*
 * This file is just to give an idea of how one might implement a game using this library
 */

// TODO implement user interface
const ui = {

    players: [ new Player(), new Player()],

    selectTilePlacement(player: Player, placementOptions: PlaceTileAction[]): PlaceTileAction {
        // For now just pick a random placement
        const ret = placementOptions[
            Math.floor(Math.random() * placementOptions.length)
        ];
        
        // Log it
        console.log(player.color + ": placed tile " + ret.tile.constructor.name
            + " with rotation " + ret.tile.rotation * 90 
            + "° at " + ret.x + ", " + ret.y
        );

        return ret;
    },

    promptWantToAddFollowers(player: Player) {
        // For now just random
        return Math.random() > 0.5;
    },

    selectFollowerPlacement(player: Player, followerOptions: Follower[]) {
        // For now just pick a random placement
        const ret = followerOptions[
            Math.floor(Math.random() * followerOptions.length)
        ];

        console.log(player.color + ": placed follower " + Follower.Type[ret.type] 
            + " at " + ret.tile.constructor.name + " position " + ret.positionString()
        );
        
        return ret;
    }

};


// Create game
console.log("Stating game...");
ui.players[0].color = Player.Color.RED;
ui.players[1].color = Player.Color.GREEN;
const game = new Game(ui.players);

let turns = 0;

// Game turn loop
while (!game.over()) {
    turns++;
    const p = game.turn.player;
    console.log("\n\n" + p.color + " player's turn.");
    // Make user select placement option
    const placement = ui.selectTilePlacement(game.turn.player, game.turn.placementOptions);

    // Prompt followers
    const followerPlacementOptions = placement.getFollowerOptions();
    if (followerPlacementOptions.length !== 0
        && ui.promptWantToAddFollowers(game.turn.player)
    )
        placement.setFollower(
            ui.selectFollowerPlacement(game.turn.player, followerPlacementOptions)
        );

    // Execute turn
    game.turn.act(placement);
}

console.log("Game over. total turns: ", turns);
const bb = game.table.grid.boundingBox();
console.log("Table bounding box: ", bb?.join());

// Print table
console.log("Table:");
const [[x0, y0], [x1, y1]] = bb;
for (let x = x0; x <= x1; x++) {
    let line = '';
    for (let y = y0; y <= y1; y++) {
        const t = game.table.grid.get(x, y);
        if (!t)
            line += ' ';
        else
            line += t.followers.length;
    }
    console.log(line);
}