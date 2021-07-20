import { ShipDirection } from "./ship-direction.enum";
import { ShipType } from "./ship-type";

export class Ship {
    public name: string;
    public health: number;
    public length: number;
    public direction: ShipDirection;

    constructor(
        type: ShipType,
        direction: ShipDirection
    ) {
        this.name = type.name;
        this.health = type.health;
        this.length = type.length;
        this.direction = direction;
    }
}
