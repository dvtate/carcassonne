// import GameAction from './GameAction';
import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';
import Tile from './Tile';
import TileStack from './TileStack';
import Follower from './Follower';

import { GameTurn, PlaceTileAction } from './GameAction';

/**
 * The interfac
 */
export default class Game {
    /**
     * The map of tiles in play
     */
    table: Table = new Table();

    /**
     * The game tiles to pull from
     */
    tileStack: TileStack = new TileStack();

    /**
     * Scoring system
     */
    scoreBoard: ScoreBoard;

    /**
     * Players in the game
     */
    players: Player[];

    /**
     * Player who's turn it is to play
     */
    playerIndex: number = 0;

    /**
     * Next playable turn
     */
    turn: GameTurn;

    /**
     * @constructor
     * @param players array of players in clockwise order (order of play)
     */
    constructor(players: Player[]) {
        this.players = players;

        // Initialize scoreboard
        this.scoreBoard = new ScoreBoard(this.players);

        // Place starting tile onto the board
        this.table.placeTile(new TileStack.startingTile(), 0, 0);
    }

    currentPlayer() {
        return this.players[this.playerIndex];
    }

    /**
     *
     */
    private initTurn() {
        let actions: PlaceTileAction[];
        const discarded = [];
        let tile: Tile;
        while (!this.tileStack.empty()) {
            // Pull a card and see what we can do with it
            tile = this.tileStack.pull();
            actions = this.table.legalPlacements(tile).map(([x, y, rotation]) =>
                new PlaceTileAction(this, tile, x, y, rotation));

            // Continue if unable to place tile
            if (actions.length !== 0)
                break;
            discarded.push(tile);
        }

        if (this.tileStack.empty())
            this.turn = new GameTurn(this, null, actions, discarded, null);
        else
            this.turn = new GameTurn(this, this.players[this.playerIndex], actions, discarded, tile);
    }
};