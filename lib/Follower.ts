import Tile from "./Tile";
import Player from './Player';

/**
 * What role the follower is fulfilling
 */
export enum FollowerType {
    /**
     * In the actual game thiefs stand in roads
     */
    THIEF,

    /**
     * In the actual game monks stand in cloisters
     */
    MONK,

    /**
     * In the actual game farmers lay in fields
     */
    FARMER,

    /**
     * In the actual game knights stand in cities
     */
    KNIGHT,
};

/**
 * Followers are used to occupy areas of the map in the game
 */
export default class Follower {
    // Nested follower type
    static Type = FollowerType;

    /**
     * Where is the follower located?
     */
    tile: Tile;

    /**
     * Who does the follower belong to?
     */
    player: Player;

    /**
     * What role is the follower playing?
     */
    type: FollowerType;

    // TODO should probably move this to children extend this...
    /**
     * Where in the tile is the follower located?
     * Only relevant to farmer and knight followers
     * 0    : top
     * 0.5  : top-right
     * 1    : right
     * 1.5  : bottom-right
     * 3    : bottom-left
     * 3.5  : top-left
     */
    position: number;

    /**
     *
     * @param type
     * @param tile
     * @param position
     * @param player
     */
    constructor(type: FollowerType, tile: Tile = null, position = 0, player: Player = null) {
        this.type = type;
        this.tile = tile;
        this.position = position;
        this.player = player;
    }
};