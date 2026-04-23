/**
 * Sparse Matrix
 */
export default class SparseMatrix<T> {
    /**
     * Dictionary of coordinates to values
     */
    private grid: { [x: number] : { [y: number] : T }} = {};

    /**
     * Get value from grid
     * @param x x-coordinate
     * @param y y-coordinate
     * @returns value at given coordinates
     */
    get(x: number, y: number) {
        return this.grid[x] && this.grid[x][y];
    }

    /**
     * Set value in grid
     * @param x x-coordinate
     * @param y y-coordinate
     * @param value value to put at coordinate
     */
    set(x: number, y: number, value: T) {
        if (!this.grid[x])
            this.grid[x] = {};
        this.grid[x][y] = value;
    }

    /**
     * Get a list of entries on the grid
     * @returns list of entries as [x, y, value] tuples
     */
    entries() {
        const ret: Array<[number, number, T]> = [];
        for (const x in this.grid)
            for (const y in this.grid[x])
                ret.push([Number(x), Number(y), this.grid[x][y]]);
        return ret;
    }

    /**
     * Iterate over the entries
     */
    *[Symbol.iterator]() {
        for (const x in this.grid)
            for (const y in this.grid[x])
                yield [Number(x), Number(y), this.grid[x][y]];
    }

    /**
     * Find coordinates of first instance of value in the matrixc
     * @param value value to find
     * @param eq equality check function 
     * @returns coordinates of first matching instance or null
     * @remarks O(N*M) -- could iterate over all entries
     */
    find(value: T, eq = (a: T, b: T): boolean => a === b) {
        for (const x in this.grid)
            for (const y in this.grid[x])
                if (eq(this.grid[x][y], value))
                    return [Number(x), Number(y)];
        return null;
    }

    boundingBox() {
        let minX: number, maxX: number;
        let minY: number, maxY: number;
        this.entries().forEach(([x, y, _]) => {
            if (minX === undefined) {
                minX = x;
                maxX = x;
                minY = y;
                maxY = y;
                return;
            }

            if (x < minX)
                minX = x;
            else if (x > maxX)
                maxX = x;

            if (y < minY)
                minY = y;
            else if (y > maxY)
                maxY = y;
        });

        if (minX == undefined)
            return null;
        return [[minX, minY], [maxX, maxY]] ;
    }
};