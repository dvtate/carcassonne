import Follower from "./Follower";
import Player from "./Player";
import Tile from "./Tile";
import Game from "./Game";

export default abstract class GameAction {
    constructor(
        readonly game: Game,
    ) { }
};

class PlaceTile extends GameAction {
    rotation: number;
    x: number;
    y: number;
    follower?: Follower;
    followerMoves!: Follower[];

    constructor(game: Game,
        x: number, y: number, rotation: number) {
        super(game);
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }

    validFollowers() {

    }
};

class PlaceFollower extends GameAction {

}