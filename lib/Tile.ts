import Follower from './Follower';

// Represents tile border types
enum BorderType {
    // Urban Area
    CITY = 'c',

    // Green field without roads
    FARM = 'f',

    // Green field with roads
    ROAD = 'r',
};

// Borders for a 4-sided tile
type QuadBorders = [BorderType, BorderType, BorderType, BorderType];

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
};


/*
 * These are listed in the same order as in page 16 of the CarcassonneRules.pdf file
 */

// TODO note that the base game art in some cases is rotated differently so if an exact clone is to be made
//   we would want to rotate some tiles base borders

export class CCCCTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.CITY];
    }
};

export class CCCFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.FARM];
    }
};

export class CCCF2Tile extends CCCFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

export class CCCRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.CITY, BorderType.ROAD];
    }
};

export class CCCR2Tile extends CCCRTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

export class CCFFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.FARM, BorderType.FARM];
    }
};

export class CCFF2Tile extends CCFFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

// Like base CCFF but without connected city borders
export class CCFF3Tile extends CCFFTile {
    /**
     * @override
     */
    cityConnected(): false {
        return false;
    }
};

export class CCRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.CITY, BorderType.ROAD, BorderType.ROAD];
    }
};

export class CCRR2Tile extends CCRRTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

export class CFCFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.CITY, BorderType.FARM];
    }
};

export class CFCF2Tile extends CFCFTile {
    /**
     * @override
     */
    hasPennant() {
        return true;
    }
};

// Like base CFCF but witohut connected city borders
export class CFCF3Tile extends CFCFTile {
    /**
     * @override
     */
    cityConnected() {
        return false;
    }
};

export class CFFFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.FARM, BorderType.FARM];
    }
};

export class CFRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.FARM, BorderType.ROAD, BorderType.ROAD];
    }
};

// This is also the starting tile
export class CRFRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.FARM, BorderType.ROAD];
    }
};

export class CRRFTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.ROAD, BorderType.FARM];
    }
};

export class CRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.CITY, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }
};

// Cloister Farm Tile
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
};

// Cloister Farm + Road tile
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
};

export class FFRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.FARM, BorderType.ROAD, BorderType.ROAD];
    }
};

export class FRFRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.ROAD, BorderType.FARM, BorderType.ROAD];
    }
};

export class FRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.FARM, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }
};

export class RRRRTile extends Tile {
    getBaseBorders(): QuadBorders {
        return [BorderType.ROAD, BorderType.ROAD, BorderType.ROAD, BorderType.ROAD];
    }
};