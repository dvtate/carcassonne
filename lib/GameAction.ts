import Follower from "./Follower";
import Player from "./Player";
import Tile from "./Tile";
import Game from "./Game";
import Table from "./Table";


// TODO this class should inherit from an abstract base or implement an interface
//      as it's likely we will also need a GameOverTurn class

/**
 * All the information relevant for the player to make their turn
 */
export class GameTurn {
    // TODO should also include current score

    /**
     * What to do when this turn is executed
     */
    protected action: PlaceTileAction = null;

    /**
     * @param game Game that this turn is associated with
     * @param player Player whos turn it is
     * @param placementOptions Valid moves for this turn
     * @param discardedTiles Tiles that could not be placed and had to be discarded for this turn
     * @param tile relevant tile that must be placed this turn
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
     * Perform action
     * @param placement tile placement action from this.placementOptions
     */
    act(placement: PlaceTileAction) {
        if (!this.placementOptions.includes(placement))
            throw new Error('placement must be one of the options in this.placementOptions');
        this.action = placement;
        this.game.handleTurn();
    }

    /**
     * Get the action to be executed this turn
     * @returns action field or null
     */
    getAction() {
        return this.action;
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
    /**
     * Cache for valid follower options
     */
    private validFollowers!: Follower[];

    /**
     * @param game parent game object
     * @param tile tile being placed
     * @param x x coordinate for tile placement
     * @param y y coordinate for tile placement
     * @param rotation tile rotation
     * @param table table on which tiles are placed
     */
    constructor(
        public readonly game: Game,
        public readonly tile: Tile,
        public readonly x: number,
        public readonly y: number,
        public readonly rotation: number,
        private table: Table,
    ) {

    }

    /**
     * Get a set of valid follower placements to combine with this tile placement
     */
    getFollowerOptions() {
        // Use cache if possible
        if (this.validFollowers)
            return this.validFollowers;

        // Find valid followers for tile and save in cache
        return this.validFollowers = this.table
            .validFollowers(this.x, this.y, this.game.turn.tile, this.rotation)
    }

    /**
     * In addition to placing the tile we'll also add a follower
     * @param follower follower provided by PlaceTileAction.getFollowerOptions()
     */
    setFollower(follower: Follower) {
        // Verify it's one of the ones we generated
        if (!this.getFollowerOptions().includes(follower))
            throw new Error('Please use a follower provided by this.getFollowerOptions()');

        // Can only add one follower to tile
        if (this.tile.getFollowers().length !== 0)
            throw new Error('Can only add one follower!');

        // Add follower to tile
        this.tile.addFollower(follower);
    }
};