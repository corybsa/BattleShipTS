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
            let result: HitType;
            let row: number;
            let col: number;

            do {
                row = Math.floor(Math.random() * this.playerBoard.rows);
                col = Math.floor(Math.random() * this.playerBoard.columns);
                result = this.playerBoard.slotClick(row, col);
            } while(result === HitType.ERROR);

            if(result === HitType.HIT) {
                this.lastHit = { row, col, dir: null };
            }
        } else {
            if(this.lastHit.dir === null) {
                this.lastHit.dir = ShipDirection.UP;
            }
            
            let result: HitType;
            let row: number;
            let col: number;
            let dir: ShipDirection;

            do {
                row = this.lastHit.row;
                col = this.lastHit.col;
                dir = this.checkBoundaries(row, col, this.lastHit.dir);

                switch(dir) {
                    case ShipDirection.UP:
                        row--;

                        break;
                    case ShipDirection.RIGHT:
                        col++;

                        break;
                    case ShipDirection.DOWN:
                        row++;

                        break;
                    case ShipDirection.LEFT:
                        col--;

                        break;
                }
                
                result = this.playerBoard.slotClick(row, col);

                switch(result) {
                    case HitType.HIT:
                        this.lastHit.row = row;
                        this.lastHit.col = col;
                        this.lastHit.dir = dir;

                        break;
                    case HitType.DESTROY:
                        this.lastHit = null;
                        // TODO: handle case when ai hits multiple ships without destroying the first ship
                        // TODO: ai doesn't know that it destroyed a ship and loops infinitely

                        break;
                    case HitType.MISS:
                    case HitType.ERROR:
                        // rotate directions
                        this.lastHit.dir = (this.lastHit.dir + 1) % 4;

                        break;
                }
            } while(result === HitType.ERROR);
        }
    }

    private checkBoundaries(row: number, col: number, dir: ShipDirection): ShipDirection {
        switch(dir) {
            case ShipDirection.UP:
                if(row === 0) {
                    dir = ShipDirection.RIGHT;
                    dir = this.checkBoundaries(row, col, dir);
                }

                break;
            case ShipDirection.RIGHT:
                if(col === this.playerBoard.columns - 1) {
                    dir = ShipDirection.DOWN;
                    dir = this.checkBoundaries(row, col, dir);
                }

                break;
            case ShipDirection.DOWN:
                if(row === this.playerBoard.rows - 1) {
                    dir = ShipDirection.LEFT;
                    dir = this.checkBoundaries(row, col, dir);
                }

                break;
            case ShipDirection.LEFT:
                if(col === 0) {
                    dir = ShipDirection.UP;
                    dir = this.checkBoundaries(row, col, dir);
                }

                break;
        }

        return dir;
    }
}
