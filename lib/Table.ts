import Tile from "./Tile";
import SparseMatrix from './ds/SparseMatrix';
import Follower, { FollowerType } from "./Follower";
import { FarmBorder } from "./FarmBorder";

// Where the tiles get placed
export default class Table {
    // Location Map
    grid: SparseMatrix<Tile>;

    /**
     * Find spots where a tile could be placed
     * @returns array of x,y coordinates
     */
    private getEmptySpots(): [number, number][] {
        // TOOD this should be replaced with an iterative system

        // Flood-fill algorithm
        return (function rec(x, y, ret: [number, number][], seen) {
            // Base case
            if (seen.get(x, y))
                return ret;
            seen.set(x, y, true);

            // If tile is empty
            const tile = this.grid.get(x, y);
            if (!tile) {
                ret.push([x, y]);
                return ret;
            }

            // Branch out
            rec(x, y + 1, ret, seen);
            rec(x + 1, y, ret, seen);
            rec(x, y - 1, ret, seen);
            rec(x - 1, y, ret, seen);
            return ret;
        })(0, 0, [], new SparseMatrix<boolean>());
    }

    /**
     * Can we place given tile as specified?
     * @param tile tile object
     * @param x x coordinate
     * @param y y coordinate
     * @param rotation how much to rotate it
     * @returns true if can place false if not
     */
    private canPlaceTile(tile: Tile, x: number, y: number, rotation: number) {
        // Get neighboring borders
        const neighbors = [
            this.grid.get(x, y + 1),
            this.grid.get(x + 1, y),
            this.grid.get(x, y - 1),
            this.grid.get(x - 1, y),
        ].map((n, i) =>
            n && n.getBorders()[(i + 2) % 4]);

        // Check if borders line up
        const borders = tile.getBorders(rotation);
        for (let i = 0; i < 4; i++)
            if (neighbors[i] && borders[i] !== neighbors[i])
                return false;
        return true;
    }

    /**
     * Returns a set of ways the tile can be paced
     * @param tile tile that has to be placed
     */
    legalPlacements(tile: Tile) {
        const ret: [number, number, number][] = [];
        for (const [x, y] of this.getEmptySpots())
            for (let rotation = 0; rotation < 4; rotation++)
                if (this.canPlaceTile(tile, x, y, rotation))
                    ret.push([x, y, rotation]);
        return ret;
    }

    /**
     * Put tile into play
     * @param tile Tile to place
     * @param x x coord
     * @param y y coord
     * @param rotation rotations to perform on tile
     */
    placeTile(tile: Tile, x: number, y: number, rotation = tile.rotation) {
        tile.rotation = rotation;
        this.grid.set(x, y, tile);
    }
    /**
     * Get valid followers for a hypothetical tile placement
     * @param x x coord
     * @param y y coord
     * @param tile relevant tile
     * @param rotation rotation for tile
     * @returns set of valid followers for tile
     */
    validFollowers(x: number, y: number, tile: Tile = this.grid.get(x, y), rotation?: number) {
        // Unique tile elements
        const tileBorders = tile.getBorders(rotation);

        // Check conditions for monk
        const ret: Follower[] = [];
        if (tile.hasCloister())
            ret.push(new Follower(Follower.Type.MONK, tile));

        // Check conditions for thief
        if (tileBorders.includes(Tile.Border.ROAD)) {
            const roadBorders = tileBorders.map(b => b === Tile.Border.ROAD);
            if (!this.roadOccupied(x, y, roadBorders)) {
                // List of road directions
                const directions = roadBorders
                    .map((b, i) => b ? i : null)
                    .filter(e => e !== null)

                // Add relevant follower options
                if (directions.length <= 2)
                    ret.push(new Follower(Follower.Type.THIEF, tile, directions[0]));
                else
                    ret.push(...directions.map(d => new Follower(Follower.Type.THIEF, tile, d)));
            }

        }

        // Check conditions for knight
        if (tileBorders.includes(Tile.Border.CITY)) {
            const cityBorders = tileBorders.map(b => b === Tile.Border.CITY);
            if (tile.cityConnected()) {
                if (!this.cityOccupied(x, y, cityBorders))
                    ret.push(new Follower(Follower.Type.KNIGHT, tile, cityBorders.indexOf(true)));
            } else {
                cityBorders.forEach((b, i) => {
                    if (b) {
                        const directions = [false, false, false, false];
                        directions[i] = true;
                        if (this.roadOccupied(x, y, directions))
                            ret.push(new Follower(Follower.Type.KNIGHT, tile, i));
                    }
                })
            }
        }

        // Check conditions for farmer
        if (tileBorders.includes(Tile.Border.ROAD) || tileBorders.includes(Tile.Border.FARM)) {
            const farms = tile.farmConnections(rotation);
            farms.forEach(farm => {
                if (!this.farmOccupied(x, y, farm)) {
                    const segs = farm.getSegments();
                    ret.push(new Follower(Follower.Type.FARMER, tile, segs[1] || segs[0]));
                }
            });
        }

        return ret;
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
        // TODO this might be incorrect behavior with respect to intersections

        // Get the borders of the tile which have roads, excluding previous tile
        const getRoadBorders = (t: Tile, i: number) => {
            const badIdx = (i + 2) % 4;
            return t.getBorders().map((b, i) => b === Tile.Border.ROAD && i != badIdx);
        };

        // Check neighbors
        for (let i = 0; i < 4; i++) {
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
        for (let i = 0; i < 4; i++) {
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

            // Tile occupied by knight
            const hasKnight = tile.getFollowers().some(f =>
                f.type === Follower.Type.KNIGHT
                && (f.position === ((i + 2) % 4) || tile.cityConnected()));
            if (hasKnight)
                return true;

            // We can't DFS neighbors because it's not connected
            if (!tile.cityConnected())
                continue;

            // Recursively search this tile
            set.add(tile);
            if (this.cityOccupied(neighborX, neighborY, getCityBorders(tile, i), set))
                return true;
        }

        // City unoccupied
        return false;
    }

    /**
     * Is this farm area already designated to a farmer?
     * @param x starting x coordinate
     * @param y starting y coordinate
     * @param farm farmborder to use
     * @param set set to prevent looping
     */
    farmOccupied(x: number, y: number, farm: FarmBorder, set = new Set()) {
        // Check neighbors
        const directions = farm.tileDirections();
        for (let i = 0; i < 4; i++) {
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

            // Skip if other tile's farms not connected
            const connFarm = tile.farmConnections().find(f => farm.connected(f, i));
            if (!connFarm)
                continue;

            // Already have a farmer
            const occupied = tile.getFollowers().some(f =>
                f.type === Follower.Type.FARMER && connFarm.contains(f.position))
            if (occupied)
                return true;

            // DFS other connected farms
            set.add(tile);
            if (this.farmOccupied(neighborX, neighborY, connFarm, set))
                return true;
        }

        // Unoccupied
        return false;
    }
};