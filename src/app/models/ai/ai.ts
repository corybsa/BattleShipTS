import { Board } from "../board/board";

export class AI {
    private playerBoard: Board;

    constructor(board: Board) {
        this.playerBoard = board;
    }

    public attack() {
        let row = Math.floor(Math.random() * this.playerBoard.rows);
        let col = Math.floor(Math.random() * this.playerBoard.columns);

        this.playerBoard.slotClick(row, col);
    }
}
