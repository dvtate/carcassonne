import Follower from "./Follower";
import Player from "./Player";
import Tile from "./Tile";
import Game from "./Game";

/**
 * Player's turn
 */
export class GameTurn {
    /**
     * @constructor
     * @param player relevant player
     * @param actions their available actions
     * @param discardedTiles
     */
    constructor(
        public readonly game: Game,
        public readonly player: Player,
        public readonly placementOptions: PlaceTileAction[],
        public readonly discardedTiles: Tile[] = [],
        public readonly tile: Tile,
    ) {

    }

    /**
     * @param x x coordinate
     * @param y y coordinate
     * @param rotation rotation
     * @returns placement option if that placement is valid, otherwise gives a
     */
    findPlacement(x: number, y: number, rotation: number) {
        return this.placementOptions.find(e =>
            e.x === x && e.y === y && e.rotation === rotation);
    }
};

/**
 * User decides to place a tile
 */
export class PlaceTileAction {
    follower!: Follower;
    validFollowers!: Follower[];

    /**
     * @param game parent game object
     * @param tile tile being placed
     * @param x x coordinate for tile placement
     * @param y y coordinate for tile placement
     * @param rotation tile rotation
     */
    constructor(
        public readonly game: Game,
        public readonly tile: Tile,
        public readonly x: number,
        public readonly y: number,
        public readonly rotation: number
    ) {

    }

    /**
     * Get a set of valid follower placements to combine with this tile placement
     */
    getFollowerOptions() {
        if (this.validFollowers)
            return this.validFollowers;

        return this.validFollowers = this.game.table
            .validFollowers(this.x, this.y, this.game.turn.tile, this.rotation)
    }

    /**
     * In addition to placing the tile we'll also add a follower
     * @param follower follower provided by PlaceTileAction.getFollowerOptions()
     */
    setFollower(follower: Follower) {
        // Verify it's one of the ones we generated
        if (!this.validFollowers.includes(follower))
            throw new Error('Please use a follower provided by getFollowerOptions');

        this.follower = follower;
    }
};