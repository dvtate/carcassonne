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
    roadOccupied(x: number, y: number, directions: boolean[], set = new Set()): boolean {
        // Get the borders of the tile which have roads, excluding ourselves
        const getRoadborders = (t: Tile, i: string) => {
            const badIdx = (Number(i) + 2) % 4;
            return t.getBorders().map((b, i) => b === Tile.Border.ROAD && i != badIdx);
        };

        // Check neighbors
        for (const i in directions) {
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
            if (this.roadOccupied(neighborX, neighborY, getRoadborders(tile, i), set))
                return true;
        }

        // Road unoccupied
        return false;
    }
};