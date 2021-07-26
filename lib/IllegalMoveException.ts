

/**
 * Exception that's thrown when the player performs an illegal action
 * For example placing a tile such that it's borders don't match neighbors
 */
export default class IllegalMoveException extends Error {
    /**
     * @constructor
     * @param msg reason for error
     */
    constructor(msg: string) {
        super(msg);
    }
};