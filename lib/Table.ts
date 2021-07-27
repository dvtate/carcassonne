import Tile from "./Tile";
import SparseMatrix from './ds/SparseMatrix';
import Follower, { FollowerType } from "./Follower";

// Where the tiles get placed
export default class Table {
    // Location Map
    grid: SparseMatrix<Tile>;


    canPlaceTile(tile: Tile, x: number, y: number, rotation: number) {

    }

    legalMoves(tile: Tile) {

    }


    /**
     * Get a valid follower types for this location
     * @param x x position
     * @param y y position
     * @param tile
     */
    validFollowerTypes(x: number, y: number, tile: Tile = this.grid.get(x, y), rotation: number = 0) {
        // Unique tile elements
        const tileBorders = tile.getBorders(rotation);

        // Check conditions for monk
        const ret: FollowerType[] = [];
        if (tile.hasCloister())
            ret.push(Follower.Type.MONK);

        // Check conditions for thief
        if (tileBorders.includes(Tile.Border.ROAD)) {
            const roadBorders = tileBorders.map(b => b === Tile.Border.ROAD);
            if (!this.roadOccupied(x, y, roadBorders))
                ret.push(Follower.Type.THIEF);
        }

        // Check conditions for knight
        if (tileBorders.includes(Tile.Border.CITY)) {
            const cityBorders = tileBorders.map(b => b === Tile.Border.CITY);
            if (tile.cityConnected()) {
                if (this.cityOccupied(x, y, cityBorders))
                    ret.push(Follower.Type.KNIGHT);
            } else {
                cityBorders.forEach((b, i) => {
                    if (b) {
                        const directions = [false, false, false, false];
                        directions[i] = true;
                        if (this.roadOccupied(x, y, directions))
                            ret.push(Follower.Type.KNIGHT)
                    }
                })
            }
        }

        // TODO knight condition
        //    similar to thief but uses
        // TODO farmer condition
    }

    /**
     * Determines if the road-network at given coordinate is already controlled by a theif
     * @param x x coordinate
     * @param y y coordinate
     * @param directions NESW directions for connecting roads
     * @param set set to prevent looping work
     * @returns if the connecting road-network already has a thief
     */
    roadOccupied(x: number, y: number, directions: boolean[], set: Set<Tile> = new Set()): boolean {
        // Get the borders of the tile which have roads, excluding previous tile
        const getRoadBorders = (t: Tile, i: number) => {
            const badIdx = (i + 2) % 4;
            return t.getBorders().map((b, i) => b === Tile.Border.ROAD && i != badIdx);
        };

        // Check neighbors
        // DFS for a thief
        for (let i = 0; i < directions.length; i++) {
            // Skip if not a road border
            if (!directions[i])
                continue;

            // Get tile
            const neighborX = [0, 1, 0, -1][i] + x;
            const neighborY = [1, 0, -1, 0][i] + y;
            const tile = this.grid.get(neighborX, neighborY);

            // Skip empty or already seen tiles
            if (!tile)
                continue;
            if (set.has(tile))
                continue;

            // Tile has a theif
            if (tile.getFollowers().some(f => f.type === Follower.Type.THIEF))
                return true;

            // Recursively search this tile
            set.add(tile);
            if (this.roadOccupied(neighborX, neighborY, getRoadBorders(tile, i), set))
                return true;
        }

        // Road network unoccupied
        return false;
    }

    /**
     * Determines if the city cluster at given coordinates controlled by a knight
     * @param x starting x coordinate
     * @param y starting y coordinate
     * @param directions directions to move
     * @param set set to prevent looping
     */
    cityOccupied(x: number, y: number, directions: boolean[], set = new Set()): boolean {
        // Get the borders of the tile which have roads, excluding previous tile
        const getCityBorders = (t: Tile, i: number) => {
            const badIdx = (i + 2) % 4;
            return t.getBorders().map((b, i) => b === Tile.Border.CITY && i != badIdx);
        };

        // Check neighbors
        for (let i = 0; i < directions.length; i++) {
            // Skip if not a road border
            if (!directions[i])
                continue;

            // Get tile
            const neighborX = [0, 1, 0, -1][i] + x;
            const neighborY = [1, 0, -1, 0][i] + y;
            const tile = this.grid.get(neighborX, neighborY);

            // Skip empty or already seen tiles
            if (!tile)
                continue;
            if (set.has(tile))
                continue;

            // Tile has a theif
            if (tile.getFollowers().some(f => f.type === Follower.Type.KNIGHT && (f.position === i || tile.cityConnected())))
                return true;

            // We can't DFS neighbors because it's not connected
            if (!tile.cityConnected())
                continue;

            // Recursively search this tile
            set.add(tile);
            if (this.cityOccupied(neighborX, neighborY, getCityBorders(tile, i), set))
                return true;
        }

        // Road network unoccupied
        return false;
    }

    farmOccupied(x: number, y: number, ) {

    }
};