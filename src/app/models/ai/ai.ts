import { Board } from "../board/board";
import { HitType } from "../board/hit-type";
import { ShipDirection } from "../ship/ship-direction.enum";

export class AI {
    private playerBoard: Board;
    private lastHit: { row: number, col: number, dir: ShipDirection };

    constructor(board: Board) {
        this.playerBoard = board;
        this.lastHit = null;
    }

    public attack() {
        if(!this.lastHit) {
            let row = Math.floor(Math.random() * this.playerBoard.rows);
            let col = Math.floor(Math.random() * this.playerBoard.columns);

            const didHit = this.playerBoard.slotClick(row, col);

            if(didHit === HitType.ERROR) {
                // attack again
            } else {
                this.lastHit = { row, col, dir: null };
            }
        } else {
            if(this.lastHit.dir === null) {
                this.lastHit.dir = Math.floor(Math.random() * 4);
            }
            
            let row = this.lastHit.row;
            let col = this.lastHit.col;

            switch(this.lastHit.dir) {
                case ShipDirection.UP:
                    row -= 1;

                    break;
                case ShipDirection.RIGHT:
                    col += 1;

                    break;
                case ShipDirection.DOWN:
                    row += 1;

                    break;
                case ShipDirection.LEFT:
                    col -= 1;

                    break;
            }

            this.playerBoard.slotClick(row, col);
        }
    }
}
