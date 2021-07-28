

/**
 * The player's followers' colors
 */
enum PlayerColor {
    RED = "#f00",
    GREEN = "#080",
    BLUE = "#00f",
    WHITE = "#fff",
    BLACK = "#000",
    YELLOW = "#ff0",
    // TODO more colors
};

/**
 * Describes an active participant in the game
 */
export default class Player {
    /**
     * Nested player follower color enum
     */
    static Color = PlayerColor;

    /**
     * What color is the ploayer's followers
     */
    color: PlayerColor;

    /**
     * How many followers do they have at their disposal
     */
    followerSupply: number = 8;
};