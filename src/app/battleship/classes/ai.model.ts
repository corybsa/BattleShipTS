import {BattleshipComponent} from '../battleship.component';
import {PlayerType} from './player-type.model';
import {AiMemory} from './ai-memory.model';
import {Orientation} from './orientation.model';
import {HitInfo, HitType} from './hit-info.model';

/**
 * Represents the AI.
 */
export class AI {
  /**
   * @private BattleshipComponent
   * The game state.
   */
  private board: BattleshipComponent;

  /**
   * @private ShipPosition[]
   * A memory of ships hit.
   */
  private memory: AiMemory[] = [];

  constructor(board: BattleshipComponent) {
    this.board = board;
  }

  /**
   * My thought process when playing battleship:
   *  Attack at random.
   *  If I hit a ship, remember the location.
   *  If I hit a ship last turn, fire in the cardinal directions until I hit another part of the ship.
   *    If I hit a different ship, remember the new ship's location, but first I need to destroy the first ship.
   *  Once I find the correct direction to fire, keep firing until the ship is destroyed and forget about it.
   *    If I am firing in a certain direction and I miss and the ship is not destroyed, return to the original location and fire the opposite direction.
   *  Repeat.
   */
  public attack() {
    // Attack at random
    let orientation = Orientation.UP;
    let row = Math.floor(Math.random() * this.board.dimensions);
    let col = Math.floor(Math.random() * this.board.dimensions);

    // If I hit a ship last turn
    if(this.memory.length > 0) {
      // fire in the cardinal directions until I hit another part of the ship.
      // UNLESS I've already hit the ship 2 or more times.
      if(this.memory[0].coordinates.length < 2) {
        orientation = this.rotate(this.memory[0].orientation);
      }
    }

    const attackInfo: HitInfo = this.board.checkCell(row, col, PlayerType.AI);

    // check if the ai hit a ship and store the coordinates into memory if it did.
    if(attackInfo.hitType === HitType.DESTROYED) {
      // forget about the destroyed ship.
      const index = this.memory.indexOf(
        this.memory.find(item => item.shipId === attackInfo.shipId)
      );
      this.memory.splice(index, 1);

    // If I hit a ship, remember the location.
    } else if(attackInfo.hitType === HitType.HIT) {
      this.memory.push({
        orientation: orientation,
        lastAttack: attackInfo,
        shipId: attackInfo.shipId,
        coordinates: [
          { row: row, col: col }
        ]
      });
    }
  }

  /**
   * Rotates orientation of attack.
   *
   * @param orientation {@link Orientation}: The current orientation.
   */
  private rotate(orientation): Orientation {
    switch(orientation) {
      case Orientation.UP:
        return Orientation.RIGHT;
      case Orientation.RIGHT:
        return Orientation.DOWN;
      case Orientation.DOWN:
        return Orientation.LEFT;
      case Orientation.LEFT:
        return Orientation.UP;
    }
  }
}
