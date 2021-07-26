import Follower from "./Follower";
import Player from "./Player";
import Tile from "./Tile";


abstract class GameAction {
    player: Player;
    tile: Tile;
};

class PlaceTile extends GameAction {
    rotation: number;
    x: number;
    y: number;
    follower?: Follower;

    constructor(player: Player, tile: Tile, rotation: number, x: number, y: number) {
        super();
        this.player = player;
        this.tile = tile;
        this.rotation = rotation;
        this.x = x;
        this.y = y;
    }

    validFollowerTypes() {
    }

    addFollower() {

    }
};