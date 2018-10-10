import {Orientation} from './orientation.model';

export class Ship {
  private size: number;
  private health: number;
  private name: string;
  private orientation: Orientation;

  constructor(size: number, name: string) {
    this.size = size;
    this.health = size;
    this.name = name;
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
