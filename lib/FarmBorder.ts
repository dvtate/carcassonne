import Tile from './Tile'

/**
 * Bisected square edges
 */
export enum FarmBorderSegment {
    TOP_TOP_RIGHT = 0,      // 0 - 0.5
    SIDE_TOP_RIGHT = 0.5,   // 0.5 - 1
    SIDE_BOT_RIGHT = 1,     // 1 - 1.5
    BOT_BOT_RIGHT = 1.5,    // ...
    BOT_BOT_LEFT = 2,
    SIDE_BOT_LEFT = 2.5,
    SIDE_TOP_LEFT = 3,
    TOP_TOP_LEFT = 3.5,     // 3.5 - 4
};

/**
 * Represents Inter-tile borders for farm regions
 */
export abstract class FarmBorder {
    /**
     * What tile does this border belong to?
     */
    tile: Tile = null;

    /**
     * @param tile tile to which the borders belong to
     */
    constructor(tile: Tile) {
        this.tile = tile;
    }

    /**
     * Segment enum
     */
    static Segment = FarmBorderSegment;

    /**
     * Segments on other tiles which would correspond with current tile
     */
    private static matchingSegmentDict: { [k in FarmBorderSegment]?: FarmBorderSegment } = (() => {
        const ret = {};
        ret[ret[FarmBorderSegment.TOP_TOP_LEFT]  = FarmBorderSegment.BOT_BOT_LEFT]
            = FarmBorderSegment.TOP_TOP_LEFT;
        ret[ret[FarmBorderSegment.TOP_TOP_RIGHT] =  FarmBorderSegment.BOT_BOT_RIGHT]
            = FarmBorderSegment.TOP_TOP_RIGHT;
        ret[ret[FarmBorderSegment.SIDE_TOP_LEFT] =  FarmBorderSegment.SIDE_TOP_RIGHT]
            = FarmBorderSegment.SIDE_TOP_LEFT;
        ret[ret[FarmBorderSegment.SIDE_BOT_LEFT] = FarmBorderSegment.SIDE_BOT_RIGHT]
            = FarmBorderSegment.SIDE_BOT_LEFT;
        return ret;
    })();

    /**
     * What segment on other tiles would line up with this segment
     * @param origin
     * @returns
     */
    static matchingSegment(origin: FarmBorderSegment) {
        return FarmBorder.matchingSegmentDict[origin];
    }


    /**
     * Verify border contains this segment
     * @param segment segment to check
     */
    abstract includes(segment: FarmBorderSegment): boolean;
}

/**
 * Continuous border interface
 */
export class FarmBorderArea extends FarmBorder {
    /**
     * All connected segments
     */
    segments: FarmBorderSegment[]

    /**
     * @param tile relevant tile
     * @param param0 rotational start and end of the region
     * @param rotation rotation to perform
     */
    constructor(tile: Tile, [start, end] : number[], rotation: number = 0) {
        super(tile);

        // Perform rotation
        start += rotation;
        end += rotation;

        // Prevent duplicates
        if (end - start > 4) {
            end = start + 4;
            // This should never happen
            console.error(`${this.constructor.name}: start and end should differ by < 4 (got [${start}, ${end}])`);
        }

        // Populate segments
        this.segments = [];
        while (start < end) {
            this.segments.push(start % 4);
            start += 0.5;
        }
    }

    includes(segment: FarmBorderSegment) {
        return this.segments.includes(segment);
    }
};

/**
 * Passageway between borders
 *
 * The only tile like this in base game is cfcf with disjoint cities
 */
export class FarmBorderPassageway extends FarmBorder {
    /**
     * Connection side a of passageway
     */
    a: FarmBorderArea;

    /**
     * Connection side b of passageway
     */
    b: FarmBorderArea;

    /**
     * @param tile relevant tile
     * @param param0 rotational start and ends for the two portals
     * @param rotation rotation to perform
     */
    constructor(tile: Tile, [a, b]: number[][], rotation: number = 0) {
        super(tile);
        this.a = new FarmBorderArea(tile, a, rotation);
        this.b = new FarmBorderArea(tile, b, rotation);
    }

    includes(segment: FarmBorderSegment) {
        return this.a.includes(segment) || this.b.includes(segment);
    }
};