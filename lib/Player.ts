

// The player follower colors
enum PlayerColor {
    RED = "#f00",
    GREEN = "#080",
    BLUE = "#00f",
    WHITE = "#fff",
    BLACK = "#000",
    YELLOW = "#ff0",
    // TODO more colors
};

export default class Player {
    // What color is the ploayer's followers
    static Color = PlayerColor;
    color: PlayerColor;

    followerSupply: number = 8;



};