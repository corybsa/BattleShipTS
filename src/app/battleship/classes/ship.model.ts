import {Orientation} from './orientation.model';
import {ShipType} from './ship-types.model';

export class Ship {
  private size: number;
  private health: number;
  private name: string;
  private orientation: Orientation;

  constructor(ship: ShipType) {
    this.size = ship.size;
    this.health = ship.size;
    this.name = ship.name;
  }

  public takeDamage() {
    if(this.health > 0) {
      this.health -= 1;
    }
  }

  public isDestroyed() {
    return this.health === 0;
  }

  public attack() {

  }
}
