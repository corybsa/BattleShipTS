import { ShipDirection } from "../ship/ship-direction.enum";
import { ShipType } from "../ship/ship-type";
import { BoardSlot } from "./board-slot";
import { BoardSlotStatus } from "./board-slot-status.enum";
import { HitType } from "./hit-type";

export class Board {
    public slots: BoardSlot[];
    public message: string;
    public showHints = false;

    constructor(
        public rows: number,
        public columns: number
    ) {
        this.slots = Array(this.rows * this.columns)
            .fill(null)
            .map(() => new BoardSlot());
    }

    public getRows() {
        return Array(this.rows);
    }

    public getColumns() {
        return Array(this.columns);
    }

    public getSlot(row: number, col: number) {
        return this.slots[(this.rows * row) + col];
    }

    public slotClick(row: number, col: number): HitType {
        const slot = this.slots[(this.rows * row) + col];

        if(slot.status === BoardSlotStatus.HIT || slot.status === BoardSlotStatus.MISS) {
            this.message = 'You\'ve already targeted this space, pick another one!';
            return HitType.ERROR;
        }

        if(slot.ship && slot.ship.health > 0) {
            slot.status = BoardSlotStatus.HIT;
            slot.ship.health--;
            this.message = `${slot.ship.name} was hit!`;
            
            if(slot.ship.health === 0) {
                this.message = `${slot.ship.name} destroyed!`;
                return HitType.DESTROY;
            }
        } else {
            slot.status = BoardSlotStatus.MISS;
            this.message = 'Sploooosh!';
            return HitType.MISS;
        }

        return HitType.HIT;
    }

    public placeShip(ship: ShipType, direction?: ShipDirection, row?: number, col?: number) {
        if(direction === undefined) {
            direction = Math.floor(Math.random() * 4);
        }

        if(row < 0 && row > this.rows || row === undefined) {
            row = Math.floor(Math.random() * this.rows);
        }

        if(col < 0 && col > this.columns || col === undefined) {
            col = Math.floor(Math.random() * this.columns);
        }
        
        [row, col] = this.checkCollision(row, col, ship, direction);
        this.placeShipInSlot(row, col, ship, direction);
    }

    private checkCollision(row: number, col: number, ship: ShipType, direction: ShipDirection): number[] {
        let isColliding = true;
        let loopCounter = 0;

        while(isColliding) {
            // prevent infinite loop
            if(++loopCounter > 20) {
                row = Math.floor(Math.random() * this.rows);
                col = Math.floor(Math.random() * this.columns);
            }

            // check boundary
            switch(direction) {
                case ShipDirection.UP:
                    while(ship.length > (row + 1)) {
                        row = Math.floor(Math.random() * this.rows);
                    }

                    break;
                case ShipDirection.RIGHT:
                    while(ship.length > this.columns - col) {
                        col = Math.floor(Math.random() * this.columns);
                    }

                    break;
                case ShipDirection.DOWN:
                    while(ship.length > this.rows - row) {
                        row = Math.floor(Math.random() * this.rows);
                    }

                    break;
                case ShipDirection.LEFT:
                    while(ship.length - 1 > col) {
                        col = Math.floor(Math.random() * this.columns);
                    }

                    break;
            }

            isColliding = false;

            // check other ships
            for(let i = 0; i < ship.length; i++) {
                switch(direction) {
                    case ShipDirection.UP:
                        if(this.checkForOtherShips(row - i, col)) {
                            isColliding = true;
                        }

                        break;
                    case ShipDirection.RIGHT:
                        if(this.checkForOtherShips(row, col + i)) {
                            isColliding = true;
                        }
                        
                        break;
                    case ShipDirection.DOWN:
                        if(this.checkForOtherShips(row + i, col)) {
                            isColliding = true;
                        }
                        
                        break;
                    case ShipDirection.LEFT:
                        if(this.checkForOtherShips(row, col - i)) {
                            isColliding = true;
                        }
                        
                        break;
                }
            }
        }

        return [row, col];
    }

    private checkForOtherShips(row, col): boolean {
        if(this.slots[(this.rows * row) + col].ship !== null) {
            return true;
        } else {
            return false;
        }
    }

    private placeShipInSlot(row: number, col: number, ship: ShipType, direction: ShipDirection) {
        let index: number;

        for(let i = 0; i < ship.length; i++) {
            switch(direction) {
                case ShipDirection.UP:
                    index = (this.rows * (row - i)) + col;

                    break;
                case ShipDirection.RIGHT:
                    index = (this.rows * row) + (col + i);

                    break;
                case ShipDirection.DOWN:
                    index = (this.rows * (row + i)) + col;

                    break;
                case ShipDirection.LEFT:
                    index = (this.rows * row) + (col - i);

                    break;
            }

            this.slots[index].ship = ship;
            this.slots[index].status = this.showHints ? BoardSlotStatus.INFO : BoardSlotStatus.UNTOUCHED;
        }
    }
}
