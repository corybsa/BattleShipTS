import { Board } from "../board/board";
import { HitType } from "../board/hit-type";
import { ShipDirection } from "../ship/ship-direction.enum";
import { Helper } from "../utils/helper";

export class AI {
    private playerBoard: Board;
    private lastHit: { row: number, col: number, dir: ShipDirection };
    private nextHit: { row: number, col: number, dir: ShipDirection };
    private firstHit: { row: number, col: number };
    private hitCount: number;

    constructor(board: Board) {
        this.playerBoard = board;
        this.lastHit = null;
    }

    public attack() {
        if(!this.lastHit) {
            let result: HitType;
            let row: number;
            let col: number;
            this.firstHit = null;

            do {
                row = Math.floor(Math.random() * this.playerBoard.rows);
                col = Math.floor(Math.random() * this.playerBoard.columns);
                result = this.playerBoard.slotClick(row, col);
            } while(result === HitType.ERROR);

            if(result === HitType.HIT) {
                this.hitCount = 1;
                this.lastHit = { row, col, dir: null };
                this.firstHit = { row, col };
            }
        } else {
            if(this.lastHit.dir === null) {
                this.lastHit.dir = ShipDirection.UP;
            }
            
            let result: HitType;

            if(!this.nextHit) {
                this.nextHit = Helper.copy(this.lastHit);
            }

            do {
                this.nextHit.dir = this.checkBoundaries(this.nextHit.row, this.nextHit.col, this.nextHit.dir);

                switch(this.nextHit.dir) {
                    case ShipDirection.UP:
                        this.nextHit.row--;

                        break;
                    case ShipDirection.RIGHT:
                        this.nextHit.col++;

                        break;
                    case ShipDirection.DOWN:
                        this.nextHit.row++;

                        break;
                    case ShipDirection.LEFT:
                        this.nextHit.col--;

                        break;
                }
                
                result = this.playerBoard.slotClick(this.nextHit.row, this.nextHit.col);

                switch(result) {
                    case HitType.HIT:
                        this.lastHit = Helper.copy(this.nextHit);

                        break;
                    case HitType.DESTROY:
                        this.firstHit = null;
                        this.lastHit = null;
                        this.nextHit = null;

                        break;
                    case HitType.MISS:
                    case HitType.ERROR:
                        if(this.firstHit && this.hitCount > 1) {
                            this.nextHit.row = this.firstHit.row;
                            this.nextHit.col = this.firstHit.col;
                            // reverse direction
                            this.nextHit.dir = (this.nextHit.dir + 2) % 4;
                        } else {
                            this.nextHit.row = this.lastHit.row;
                            this.nextHit.col = this.lastHit.col;
                            // rotate directions
                            this.nextHit.dir = (this.nextHit.dir + 1) % 4;
                        }

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
