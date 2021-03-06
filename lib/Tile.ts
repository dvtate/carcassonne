import Follower from './Follower';
import { FarmBorder, FarmBorderArea, FarmBorderPassageway } from './FarmBorder'

// Represents tile border types
enum BorderType {
    /**
     * Urban area
     */
    CITY = 'c',

    /**
     * Green field without roads
     */
    FARM = 'f',

    /**
     * Green field with roads
     */
    ROAD = 'r',
};

// Borders for a 4-sided tile
type QuadBorders = [BorderType, BorderType, BorderType, BorderType];

/**
 * Represents a land tile in the game
 * @abstract Each type of tile extends this abstract base
 */
export default abstract class Tile {
    /**
     * Nested BorderType enum
     */
    static Border = BorderType;

    /**
     * Number of times to rotate Tile clockwise by 90 degrees
     */
    rotation: number = 0;

    /**
     * Follower deployed to this tile
     */
    followers: Follower[] = [];

    /**
     * Rotate a piece and it's borders
     * @param clockwiseTimes90 - number of times to rotate the tile 90 degrees
     */
    rotate(clockwiseTimes90: number) {
        this.rotation += clockwiseTimes90;
        this.rotation %= 4;
    }

    /**
     * Get rotated border
     * @param rotation temporary version of this.rotation
     */
    getBorders(rotation: number = this.rotation): QuadBorders {
        const baseBorders = this.getBaseBorders();
        return [
            baseBorders[rotation],
            baseBorders[(rotation + 1) % 4],
            baseBorders[(rotation + 2) % 4],
            baseBorders[(rotation + 3) % 4],
        ];
    }

    /**
     * Does this tile contain a cloister?
     * @returns true if the tile contains a cloister
     * @virtual
     */
    hasCloister(): boolean {
        return false;
    }

    /**
     * Are the two city borders of this tile connected?
     * @returns true if city borders are connected
     * @virtual
     */
    cityConnected(): boolean {
        return true;
    }

    /**
     * Get the non-rotated borders for this class of tiles
     */
    abstract getBaseBorders(): QuadBorders;

    /**
     * Does the city item have a pennant giving it 2 additional points in value?
     * @returns true if there is a pennant in the city area
     * @virtual
     */
    hasPennant(): boolean {
        return false;
    }

    /**
     * Get the followers stationed here
     * @returns followers member
     */
    getFollowers() {
        return this.followers.slice();
    }

    /**
     * Station a follower to this tile
     * @param follower follower to add
     */
    addFollower(follower: Follower) {
        this.followers.push(follower);
    }

    /**
     * Duplicate tile
     * @returns new tile like this one
     */
    clone() {
        const ret = new (this.constructor as new () => Tile)();
        ret.rotation = this.rotation;
        ret.followers = this.followers.slice();
        return ret;
    }

    /**
     * Discover farm border connections for this tile
     * @param rotation amount to rotate tile by, defaults to this.rotation
     */
    abstract farmConnections(rotation?: number): FarmBorder[];
};

/*
 * These are listed in the same order as in page 16 of the CarcassonneRules.pdf file
 */

// TODO note that the base game art in some cases is rotated differently so if an exact clone is to be made
//   we would want to rotate some tiles base borders

/**
 * Represents tile 1 on page 16 of the rulebook
 */
export class CCCCTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.CITY];
    }

    farmConnections(rotation = this.rotation) {
        return [];
    }
};

/**
 * Represents tile 2 on page 16 of the rulebook
 */
export class CCCFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.FARM];
    }

    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderArea(this, [2.5, 3.5], rotation)];
    }
};

/**
 * Represents tile 3 on page 16 of the rulebook
 */
export class CCCF2Tile extends CCCFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

/**
 * Represents tile 4 on page 16 of the rulebook
 */
export class CCCRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderArea(this, [2.5, 3] , rotation), new FarmBorderArea(this, [3, 3.5], rotation)];
    }
};

/**
 * Represents tile 5 on page 16 of the rulebook
 */
export class CCCR2Tile extends CCCRTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

/**
 * Represents tile 6 on page 16 of the rulebook
 */
export class CCFFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.FARM, BorderType.FARM];
    }

    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderArea(this, [2.5, 3] , rotation)];
    }
};

/**
 * Represents tile 7 on page 16 of the rulebook
 */
export class CCFF2Tile extends CCFFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

/**
 * Represents tile 8 on page 16 of the rulebook
 * Like base CCFF but without connected city borders
 */
export class CCFF3Tile extends CCFFTile {
    /**
     * @override
     */
    cityConnected(): false {
        return false;
    }
};

/**
 * Represents tile 9 on page 16 of the rulebook
 */
export class CCRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderArea(this, [2, 3], rotation),
            new FarmBorderPassageway(this, [[1.5, 2], [3, 3.5]], rotation),
        ];
    }
};

/**
 * Represents tile 10 on page 16 of the rulebook
 */
export class CCRR2Tile extends CCRRTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

/**
 * Represents tile 11 on page 16 of the rulebook
 */
export class CFCFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.CITY, BorderType.FARM];
    }

    /**
     * @virtual
     */
    farmConnections(rotation: number = this.rotation): FarmBorder[] {
        return [
            new FarmBorderArea(this, [0.5, 1.5], rotation),
            new FarmBorderArea(this, [2.5, 3.5], rotation),
        ];
    }
};

/**
 * Represents tile 12 on page 16 of the rulebook
 */
export class CFCF2Tile extends CFCFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

/**
 * Represents tile 13 on page 16 of the rulebook
 * Like base CFCF but witohut connected city borders
 */
export class CFCF3Tile extends CFCFTile {
    /**
     * @override
     */
    cityConnected() {
        return false;
    }

    /**
     * @override
     */
    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderPassageway(this, [[0.5, 1.5], [2.5, 3.5]], rotation)];
    }
};

/**
 * Represents tile 14 on page 16 of the rulebook
 */
export class CFFFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.FARM, BorderType.FARM];
    }

    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderArea(this, [0.5, 3.5], rotation)];
    }
};

/**
 * Represents tile 15 on page 16 of the rulebook
 */
export class CFRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderPassageway(this, [[0.5, 2], [3, 3.5]], rotation),
            new FarmBorderArea(this, [2, 3], rotation),
        ];
    }
};

/**
 * Represents tile 16 on page 16 of the rulebook
 * This is also the starting tile
 */
export class CRFRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.FARM, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderPassageway(this, [[0.5, 1], [3, 3.5]], rotation),
            new FarmBorderArea(this, [1, 3], rotation),
        ];
    }
};

/**
 * Represents tile 17 on page 16 of the rulebook
 */
export class CRRFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.ROAD, BorderType.FARM];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderPassageway(this, [[0.5, 1], [2, 3.5]], rotation),
            new FarmBorderArea(this, [1, 2], rotation),
        ];
    }
};

/**
 * Represents tile 18 on page 16 of the rulebook
 */
export class CRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderPassageway(this, [[0.5, 1], [3, 3.5]], rotation),
            new FarmBorderArea(this, [1, 2], rotation),
            new FarmBorderArea(this, [2, 3], rotation),
        ];
    }
};

/**
 * Represents tile 19 on page 16 of the rulebook
 * cloister farm tile
 */
export class FFFFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.FARM, BorderType.FARM, BorderType.FARM];
    }

    /**
     * @override
     */
    hasCloister() {
        return true;
    }

    farmConnections() {
        return [new FarmBorderArea(this, [0, 4])];
    }
};

/**
 * Represents tile 20 on page 16 of the rulebook
 * cloister farm + road tile
 */
export class FFFRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.FARM, BorderType.FARM, BorderType.FARM]
    }

    /**
     * @override
     */
    hasCloister() {
        return true;
    }

    farmConnections(rotation: number = this.rotation) {
        return [new FarmBorderArea(this, [3.5, 7.5], rotation)]
    }
};

/**
 * Represents tile 21 on page 16 of the rulebook
 */
export class FFRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.FARM, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderArea(this, [2, 3], rotation),
            new FarmBorderArea(this, [3, 6], rotation),
        ];
    }
};

/**
 * Represents tile 22 on page 16 of the rulebook
 */
export class FRFRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.ROAD, BorderType.FARM, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderArea(this, [1, 3], rotation),
            new FarmBorderArea(this, [3, 5], rotation),
        ];
    }
};

/**
 * Represents tile 23 on page 16 of the rulebook
 */
export class FRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderArea(this, [1, 2], rotation),
            new FarmBorderArea(this, [2, 3], rotation),
            new FarmBorderArea(this, [3, 5], rotation),
        ];
    }
};

/**
 * Represents tile 24 on page 16 of the rulebook
 */
export class RRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.ROAD, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }

    farmConnections(rotation: number = this.rotation) {
        return [
            new FarmBorderArea(this, [0, 1], rotation),
            new FarmBorderArea(this, [1, 2], rotation),
            new FarmBorderArea(this, [2, 3], rotation),
            new FarmBorderArea(this, [3, 4], rotation),
        ];
    }
};