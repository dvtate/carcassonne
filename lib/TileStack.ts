import Tile, * as tiles from './Tile';

/**
 * Abstract factory for tile objects. Represents the stack of cards component of the game
 */
export default class TileStack {

    /**
     * Cards available for player to pull from
     */
    tiles: Tile[] = [];

    /**
     * Tiles that are unable to be played
     */
    discarded: Tile[] = [];

    /**
     * @constructor fill up the tile stack
     */
    constructor() {
        this.populate();
        this.shuffle();
    }

    /**
     * Populations of each type of tile in the stack
     */
    private static tileDistribution: [new () => Tile, number][] = [
        [tiles.CCCCTile, 1],
        [tiles.CCCFTile, 3],
        [tiles.CCCF2Tile, 1],
        [tiles.CCCRTile, 1],
        [tiles.CCCR2Tile, 2],
        [tiles.CCFFTile, 3],
        [tiles.CCFF2Tile, 2],
        [tiles.CCFF3Tile, 2],
        [tiles.CCRRTile, 3],
        [tiles.CCRR2Tile, 2],
        [tiles.CFCFTile, 1],
        [tiles.CFCF2Tile, 2],
        [tiles.CFCF3Tile, 3],
        [tiles.CFFFTile, 5],
        [tiles.CFRRTile, 3],
        [tiles.CRFRTile, 4],
        [tiles.CRRFTile, 3],
        [tiles.CRRRTile, 3],
        [tiles.FFFFTile, 4],
        [tiles.FFFRTile, 2],
        [tiles.FFRRTile, 9],
        [tiles.FRFRTile, 8],
        [tiles.FRRRTile, 4],
        [tiles.RRRRTile, 1],
    ];

    /**
     * This card will never get placed into the deck as it goes onto the board instantly
     */
    public static startingTile = tiles.CRFRTile;

    /**
     * Populate the board according to the distribution in the rulebook
     */
    private populate() {
        TileStack.tileDistribution.forEach(([ctor, count]) => {
            // One less of starting card as it's already on the board
            if (ctor === TileStack.startingTile)
                count--;
            for (let i = 0; i < count; i++)
                this.tiles.push(new ctor())
        });
    }

    /**
     * Shuffles the stack of cards
     */
    private shuffle() {
        // Shuffle via fisher-yates algorithm
        // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    /**
     * Pick a card from the stack
     * @returns tile on top of the stack
     */
    pull() {
        return this.tiles.pop();
    }

    /**
     * Remove a tile from play
     * @param tile tile to remove from play
     */
    discard(tile: Tile) {
        this.discarded.push(tile);
    }

    /**
     * checks if there are still tiles in the stack
     */
    empty() {
        return this.tiles.length !== 0;
    }
};