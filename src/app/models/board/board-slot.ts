import { ShipType } from "../ship/ship-type";
import { BoardSlotStatus } from "./board-slot-status.enum";

export class BoardSlot {
    public status: BoardSlotStatus;
    public ship: ShipType;

    constructor() {
        this.status = BoardSlotStatus.UNTOUCHED;
        this.ship = null;
    }
}
