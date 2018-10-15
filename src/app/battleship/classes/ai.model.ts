import {BattleshipComponent} from '../battleship.component';
import {PlayerType} from './player-type.model';
import {AiMemory} from './ai-memory.model';
import {Orientation} from './orientation.model';
import {HitInfo, HitType} from './hit-info.model';
import {Coordinate} from './ship-position.model';

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
    // TODO: Current logic prevents AI from rotating all 4 cells once it finds a ship.
    // TODO: I think my 'memory' system needs to be re-thought.

    // Attack at random
    let orientation = Orientation.UP;
    let row = Math.floor(Math.random() * this.board.dimensions);
    let col = Math.floor(Math.random() * this.board.dimensions);

    // If I hit a ship last turn
    if(this.memory.length > 0) {
      const memory = this.memory;
      const firstMemory = memory[0];

      // If I hit a certain ship previously, and haven't destroyed it but hit a different ship, go back to the first ship.
      if(memory.length > 1) {
        row = firstMemory.coordinates[0].row;
        col = firstMemory.coordinates[0].col;
        firstMemory.orientation = this.rotate(firstMemory.orientation);
        orientation = firstMemory.orientation;

      // If I hit a ship only once, fire in the cardinal directions.
      } else if(firstMemory.lastAttack.hitType === HitType.HIT && firstMemory.coordinates.length === 1) {
        row = firstMemory.coordinates[0].row;
        col = firstMemory.coordinates[0].col;
        firstMemory.orientation = this.rotate(firstMemory.orientation);
        orientation = firstMemory.orientation;

      // If I hit a ship in the last turn and I've hit it more than once, keep firing in that direction.
      } else if(firstMemory.lastAttack.hitType === HitType.HIT && firstMemory.coordinates.length > 1) {
        row = firstMemory.coordinates[firstMemory.coordinates.length - 1].row;
        col = firstMemory.coordinates[firstMemory.coordinates.length - 1].col;
        orientation = firstMemory.orientation;

      // If I am firing in a certain direction and I miss return to the original location and fire the opposite direction.
      } else if(firstMemory.lastAttack.hitType === HitType.MISS && firstMemory.coordinates.length > 1) {
        row = firstMemory.coordinates[0].row;
        col = firstMemory.coordinates[0].col;
        firstMemory.orientation = this.reverseOrientation(firstMemory.orientation);
        orientation = firstMemory.orientation;

      // If I hit a ship previously, rotated last turn and missed, keep rotating until I hit a ship.
      } else if(firstMemory.lastAttack.hitType === HitType.MISS && firstMemory.coordinates.length === 1) {
        row = firstMemory.coordinates[0].row;
        col = firstMemory.coordinates[0].col;
        firstMemory.orientation = this.rotate(firstMemory.orientation);
        orientation = firstMemory.orientation;
      }

      const coords: Coordinate = this.getNextCoordinates(row, col, orientation);
      row = coords.row;
      col = coords.col;
    }

    while(!this.checkCoordinates(row, col)) {
      orientation = this.reverseOrientation(orientation);

      switch(orientation) {
        case Orientation.UP:
          row -= 2;
          break;
        case Orientation.RIGHT:
          col += 2;
          break;
        case Orientation.DOWN:
          row += 2;
          break;
        case Orientation.LEFT:
          col -= 2;
          break;
      }
    }

    const attackInfo: HitInfo = this.board.checkCell(row, col, PlayerType.AI);

    if(attackInfo.hitType === HitType.NULL) {
      return this.attack();
    }

    // check if the ai hit a ship and store the coordinates into memory if it did.
    if(attackInfo.hitType === HitType.DESTROYED) {
      // forget about the destroyed ship.
      const index = this.memory.indexOf(
        this.memory.find(item => item.shipId === attackInfo.shipId)
      );
      this.memory.splice(index, 1);
    }

    // If I hit a ship, remember the location.
    if(attackInfo.hitType === HitType.HIT) {
      const memory = this.memory.find(item => item.shipId === attackInfo.shipId);

      if(memory) {
        memory.coordinates.push({ row: row, col: col });
      } else {
        this.memory.push({
          orientation: orientation,
          lastAttack: attackInfo,
          shipId: attackInfo.shipId,
          coordinates: [{
            row: row,
            col: col
          }]
        });
      }
    }

    if(attackInfo.hitType === HitType.MISS) {
      this.memory[0].lastAttack.hitType = attackInfo.hitType;
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

  /**
   * Reverses orientation of attack.
   *
   * @param orientation {@link Orientation}: The current orientation.
   */
  private reverseOrientation(orientation): Orientation {
    switch(orientation) {
      case Orientation.UP:
        return Orientation.DOWN;
      case Orientation.RIGHT:
        return Orientation.LEFT;
      case Orientation.DOWN:
        return Orientation.UP;
      case Orientation.LEFT:
        return Orientation.RIGHT;
    }
  }

  /**
   * Finds new coordinates based on orientation, row and column.
   *
   * @param row number: The current row.
   * @param col number: The current column.
   * @param orientation {@link Orientation}: The orientation to fire in.
   */
  private getNextCoordinates(row: number, col: number, orientation: Orientation): Coordinate {
    switch(orientation) {
      case Orientation.UP:
        return { row: row -= 1, col: col };
      case Orientation.RIGHT:
        return { row: row, col: col += 1 };
      case Orientation.DOWN:
        return { row: row += 1, col: col };
      case Orientation.LEFT:
        return { row: row, col: col -= 1 };
    }
  }

  private checkCoordinates(row: number, col: number) {
    return !((row < 0 || row > 9) || (col < 0 || col > 9));
  }
}
