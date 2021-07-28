import GameAction from './GameAction';
import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';
import Tile from './Tile';
import TileStack from './TileStack';



class TurnSummary {
    /**
     * @constructor
     * @param player relevant player
     * @param actions their available actions
     * @param discardedTiles
     */
    constructor(
        public readonly player: Player,
        public readonly actions: GameAction[],
        public readonly discardedTiles: Tile[] = [],
    ) {

    }
};

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


};