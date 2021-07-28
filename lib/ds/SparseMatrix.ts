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
};