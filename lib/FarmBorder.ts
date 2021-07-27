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
     * Get border segments included in this region
     */
    abstract getSegments(): FarmBorderSegment[];

    /**
     * Segments which correspond to given direction, and matches
     */
    static directionalSides = (() => {
        // Start with segments for top right half of tile
        const ret = [
            [[FarmBorderSegment.TOP_TOP_LEFT, FarmBorderSegment.TOP_TOP_RIGHT]],
            [[FarmBorderSegment.SIDE_TOP_RIGHT, FarmBorderSegment.SIDE_BOT_RIGHT]],
        ];

        // Add matching segment pairs
        ret.forEach(bs => bs.push(bs[0].map(FarmBorder.matchingSegment)))

        // Mirror
        ret.push(...ret.map(bs => bs.map(bp => bp.map(FarmBorder.matchingSegment))))
        return ret;
    })();

    /**
     * Determine if the two borders are directly connected
     * @param other Border to check against
     * @param directionToOther Rotational direction from this to other
     * @returns if the two borders are connection
     */
    connected(other: FarmBorder, directionToOther: number): boolean {
        // Get the tile intersection
        const segs = FarmBorder.directionalSides[directionToOther];

        // Verify that segments are on tile intersection
        const orig = this.getSegments().filter(s => segs[0].includes(s));
        const dest = other.getSegments().filter(s => segs[1].includes(s));
        return orig.some(s => dest.includes(FarmBorder.matchingSegment(s)))
    }

    /**
     * Direction vector for tiles to check
     * @virtual
     */
    tileDirections(): boolean[] {
        // TODO this gives false positives! and is super inefficient.. should make it pure virtual
        return [
            ...this.getSegments().map(s => Math.floor(s)),
            ...this.getSegments().map(s => Math.ceil(s) % 4),
        ].reduce((v, d) => {
            v[d] = true;
            return v;
        }, new Array(4).fill(false));
    }

    /**
     * Used to check if a rotational angle falls within the domain of this farm
     * @param rotation rotational position to use
     */
    contains(rotation: number): boolean {
        return this.getSegments().some(seg => seg === rotation || (seg + 0.5) % 4 === rotation)
    }
}

/**
 * Continuous border interface
 */
export class FarmBorderArea extends FarmBorder {
    /**
     * All connected segments
     */
    private segments: FarmBorderSegment[]

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

    getSegments() {
        return this.segments
    }

    /**
     * @override
     */
    tileDirections() {
        let start = Math.ceil(this.segments[0]);
        const end = Math.floor(this.segments[this.segments.length - 1]);
        const ret = [false, false, false, false];
        while (start != end) {
            ret[start] = true;
            start++;
            start %= 4;
        }
        return ret;
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
    private a: FarmBorderArea;

    /**
     * Connection side b of passageway
     */
    private b: FarmBorderArea;

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

    getSegments() {
        return this.a.getSegments().concat(this.b.getSegments());
    }

    /**
     * @override
     */
    tileDirections() {
        const adirs = this.a.tileDirections();
        const bdirs = this.b.tileDirections();
        for (let i = 0; i < 4; i++)
            if (bdirs[i])
                adirs[i] = true;
        return adirs;
    }
};