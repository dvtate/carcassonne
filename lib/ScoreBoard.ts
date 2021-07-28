import Player from "./Player";

/**
 * Events that contribute to scoring
 * @abstract
 */
abstract class ScoreEvent {
    /**
     * Points value of this scoring event
     */
    points: number;

    /**
     * Describe this event in a human readable way
     * @virtual
     */
    abstract describe(): string
};

/**
 * A class used to keep track of the score in a game
 */
export default class ScoreBoard {
    /**
     * List of players passed to constructor
     */
    players: Player[];

    /**
     * Scoring events for each player
     */
    private events: ScoreEvent[][];

    /**
     * @constructor
     * @param players List of player objects
     */
    constructor(players: Player[]) {
        this.players = players;
        this.events = new Array(this.players.length).fill([]);
    }

    /**
     * Add to players current score
     * @param player - player who scored
     * @param event - event to add
     */
    scoreEvent(player: Player, event: ScoreEvent) {
        this.events[this.players.indexOf(player)].push(event);
    }

    /**
     * Get the total scores for each player
     */
    points() {
        return this.events.map(es =>
            es.reduce((score, e) => score + e.points, 0))
    }

    /**
     * Summarise scoreboard
     */
    summary() {
        const points = this.points();
        const events = this.events.map(es => es.map(e => e.describe()));
        return {
            players: this.players,
            points,
            events,
        }
    }
};