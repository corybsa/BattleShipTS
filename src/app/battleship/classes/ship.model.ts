import {Orientation} from './orientation.model';
import {ShipType} from './ship-types.model';

/**
 * Represents a ship.
 *
 * @property size number: The size of the ship.
 * @property name string: The name of the ship.
 * @property orientation {@link Orientation}: The orientation of the ship.
 * @property health number: How much health the ship has left.
 */
export class Ship {
  private readonly size: number;
  private readonly name: string;
  private readonly orientation: Orientation;
  private health: number;

  constructor(ship: ShipType) {
    this.size = ship.size;
    this.health = ship.size;
    this.name = ship.name;
    this.orientation = Math.ceil(Math.random() * 4);
  }

  public getSize() {
    return this.size;
  }

  public getHealth() {
    return this.health;
  }

  public getName() {
    return this.name;
  }

  public getOrientation() {
    return this.orientation;
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
