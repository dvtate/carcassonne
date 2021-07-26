import Tile from "./Tile";
import SparseMatrix from './ds/SparseMatrix';

// Where the tiles get placed
export default class Table {
    // Location Map
    grid: SparseMatrix<Tile>;


    canPlaceTile(tile: Tile, x: number, y: number, rotation: number) {

    }

    legalMoves(tile: Tile) {

    }
};