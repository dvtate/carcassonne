import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';
import TileStack from './TileStack';

export default class Game {
    table: Table = new Table();
    tileStack: TileStack = new TileStack();
    scoreBoard: ScoreBoard;
    players: Player[];

    /**
     * @constructor
     * @param players array of players in clockwise order (order of play)
     */
    constructor(players: Player[]) {
        this.players = players;
        this.scoreBoard = new ScoreBoard(this.players);
    }
};