import {Orientation} from './orientation.model';
import {ShipProperties} from './ship-types.model';

/**
 * Represents a ship.
 *
 * @property size number: The size of the ship.
 * @property name string: The name of the ship.
 * @property orientation {@link Orientation}: The orientation of the ship.
 * @property health number: How much health the ship has left.
 * @property identifier number: The identifier of the ship type.
 */
export class Ship {
  private mSize: number;
  private mName: string;
  private mHealth: number;
  private mOrientation: Orientation;
  private mIdentifier: number;

  constructor(ship: ShipProperties) {
    this.identifier = ship.identifier;
    this.size = ship.size;
    this.health = ship.size;
    this.name = ship.name;
    this.orientation = Math.ceil(Math.random() * 4);
  }

  public get identifier() {
    return this.mIdentifier;
  }

  public set identifier(value: number) {
    this.mIdentifier = value;
  }

  public get size() {
    return this.mSize;
  }

  public set size(value: number) {
    this.mSize = value;
  }

  public get name() {
    return this.mName;
  }

  public set name(value: string) {
    this.mName = value;
  }

  public get health() {
    return this.mHealth;
  }

  public set health(value: number) {
    this.mHealth = value;
  }

  public get orientation() {
    return this.mOrientation;
  }

  public set orientation(value: Orientation) {
    this.mOrientation = value;
  }

  public takeDamage() {
    if(this.health > 0) {
      this.health -= 1;
    }
  }

  public isDestroyed() {
    return this.health === 0;
  }
}
