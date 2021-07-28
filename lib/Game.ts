// import GameAction from './GameAction';
import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';
import Tile from './Tile';
import TileStack from './TileStack';

import { GameTurn, PlaceTileAction } from './GameAction';

/**
 * User-facing API
 */
export default class Game {
    /**
     * The map of tiles in play
     */
    private table: Table = new Table();

    /**
     * The game tiles to pull from
     */
    private tileStack: TileStack = new TileStack();

    /**
     * Scoring system
     */
    private scoreBoard: ScoreBoard;

    /**
     * Players in the game
     */
    private players: Player[];

    /**
     * Player who's turn it is to play
     */
    private playerIndex: number = 0;

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

    /**
     * Is the game over yet?
     */
    over() {
        return this.tileStack.empty();
    }

    /**
     * Set up for turn
     */
    private initTurn() {
        // Set up variables
        let actions: PlaceTileAction[];
        const discarded = [];
        let tile: Tile;

        // Pull tile until we get valid one (usually first tile)
        while (!this.tileStack.empty()) {
            // Pull a tile and see what we can do with it
            tile = this.tileStack.pull();
            actions = this.table.legalPlacements(tile).map(([x, y, rotation]) =>
                new PlaceTileAction(this, tile, x, y, rotation, this.table));

            // Continue if unable to place tile
            if (actions.length !== 0)
                break;
            discarded.push(tile);
        }

        // TODO if the stack is empty end the game and give the user the score
        if (this.tileStack.empty())
            this.turn = new GameTurn(this, null, actions, discarded, null);
        else
            this.turn = new GameTurn(this, this.players[this.playerIndex], actions, discarded, tile);
    }

    /**
     * Perform the action and move on to next turn
     */
    public handleTurn() {
        // Get action
        const action = this.turn.getAction();
        if (!this.turn.getAction())
            throw new Error("Turn has not been assgined an action");

        // Place tile
        if (action instanceof PlaceTileAction) {
            this.table.placeTile(this.turn.tile, action.x, action.y, action.rotation);
        }

        // Move on to next turn
        this.turn = null;
        this.initTurn();
    }
};