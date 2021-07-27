import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';
import Tile from './Tile';
import TileStack from './TileStack';

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
    playerIndex: number;


    activeTile: Tile;

    /**
     * @constructor
     * @param players array of players in clockwise order (order of play)
     */
    constructor(players: Player[]) {
        this.players = players;
        this.scoreBoard = new ScoreBoard(this.players);
    }
};