import Tile from "./Tile";
import Player from './Player';
import TileStack from "./TileStack";
import IllegalMoveException from "./IllegalMoveException";

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

export default abstract class Follower {
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

    // Nested follower type
    public static Type = FollowerType;
};

export class KnightFollower extends Follower {
    constructor(tile: Tile, player: Player) {
        super();
        // if (!tile.getBaseBorders().includes(Tile.Border.CITY))
        //     throw IllegalMoveException()
    }
};

export class ThiefFollower extends Follower {

};

export class MonkFollower extends Follower {

};

export class FarmerFollower extends Follower {

};