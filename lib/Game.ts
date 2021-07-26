import Player from './Player';
import ScoreBoard from './ScoreBoard';
import Table from './Table';

export default class Game {
    table: Table = new Table();
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