import {AppComponent} from '../app.component';
import {PlayerType} from './player-type.model';
import {AiMemory} from './ai-memory.model';
import {Orientation} from './orientation.model';
import {Coordinate} from './ship-position.model';
import {HitInfo, HitType} from './hit-info.model';

/**
 * Represents the AI.
 */
export class AI {
  /**
   * AppComponent
   * The game state.
   */
  private board: AppComponent;

  /**
   * ShipPosition[]
   * A memory of ships hit.
   */
  private memory: AiMemory[] = [];

  constructor(board: AppComponent) {
    this.board = board;
  }

  public attack() {
    let row: number;
    let col: number;
    let orientation: Orientation = Orientation.UP;

    // is there anything in memory?
    if(this.memory.length > 0) {
      let target: AiMemory;

      // have I hit multiple ships?
      if(this.memory.length > 1) {
        // target the first ship in memory
        target = this.memory[0];

        // get the first coordinates hit
        const coords: Coordinate[] = target.coordinates;
        row = coords[0].row;
        col = coords[0].col;
        orientation = target.orientation;

        // have I hit this ship more than once?
        if(coords.length > 1) {
          // Is the next target invalid?
          const nextCoords: Coordinate = this.getNextCoordinates(row, col, orientation);
          if(!this.checkCoordinates(nextCoords.row, nextCoords.col) && !this.board.getCellInfo(nextCoords.row, nextCoords.col, PlayerType.AI)) {
            const validCell = this.checkSurroundingCells(row, col);

            // Is one of the cells around the last known good cell good?
            if(validCell !== null) {
              row = validCell.row;
              col = validCell.col;
            } else {
              // Is there a cell around any of the good cells for this ship good?
              for(const coord of this.memory[0].coordinates) {
                const valid = this.checkSurroundingCells(coord.row, coord.col);

                if(valid !== null) {
                  row = valid.row;
                  col = valid.col;
                  break;
                } else {
                  do {
                    row = Math.floor(Math.random() * 10);
                    col = Math.floor(Math.random() * 10);
                  } while(!this.board.getCellInfo(row, col, PlayerType.AI));
                }
              }
            }
          } else {
            let nextCoord = this.getNextCoordinates(row, col, orientation);

            if(!this.checkCoordinates(nextCoord.row, nextCoord.col)) {
              row = this.memory[0].coordinates[0].row;
              col = this.memory[0].coordinates[0].col;
              orientation = this.reverseOrientation(this.memory[0].orientation);

              nextCoord = this.getNextCoordinates(row, col, orientation);
              row = nextCoord.row;
              col = nextCoord.col;
            } else {
              row = nextCoord.row;
              col = nextCoord.col;
            }
          }
        } else {
          orientation = this.rotateOrientation(orientation);
        }

        const next = this.getNextCoordinates(row, col, orientation);
        row = next.row;
        col = next.col;
      } else {
        // target the first ship in memory
        target = this.memory[0];

        // Have I hit this ship more than once?
        if(target.coordinates.length > 1) {
          // get last coordinates hit and keep orientation.
          row = target.coordinates[target.coordinates.length - 1].row;
          col = target.coordinates[target.coordinates.length - 1].col;
          orientation = target.orientation;

          const nextCoords: Coordinate = this.getNextCoordinates(row, col, orientation);

          // Is the next target invalid?
          if(!this.checkCoordinates(nextCoords.row, nextCoords.col) && !this.board.getCellInfo(nextCoords.row, nextCoords.col, PlayerType.AI)) {
            const validCell = this.checkSurroundingCells(row, col);

            // Is one of the cells around the last known good cell good?
            if(validCell !== null) {
              row = validCell.row;
              col = validCell.col;
            } else {
              // Is there a cell around any of the good cells for this ship good?
              for(const coord of this.memory[0].coordinates) {
                const valid = this.checkSurroundingCells(coord.row, coord.col);

                if(valid !== null) {
                  row = valid.row;
                  col = valid.col;
                  break;
                } else {
                  do {
                    row = Math.floor(Math.random() * 10);
                    col = Math.floor(Math.random() * 10);
                  } while(!this.board.getCellInfo(row, col, PlayerType.AI));
                }
              }
            }
          } else {
            let next = this.getNextCoordinates(row, col, orientation);

            if(!this.checkCoordinates(next.row, next.col)) {
              row = this.memory[0].coordinates[0].row;
              col = this.memory[0].coordinates[0].col;
              orientation = this.reverseOrientation(this.memory[0].orientation);

              next = this.getNextCoordinates(row, col, orientation);
              row = next.row;
              col = next.col;
            } else {
              row = next.row;
              col = next.col;
            }
          }
        } else {
          row = target.coordinates[0].row;
          col = target.coordinates[0].col;
          orientation = this.rotateOrientation(target.orientation);

          const next = this.getNextCoordinates(row, col, orientation);
          row = next.row;
          col = next.col;
        }
      }
    } else {
      do {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
      } while(!this.board.getCellInfo(row, col, PlayerType.AI));
    }

    const attackInfo: HitInfo = this.board.checkCell(row, col, PlayerType.AI);

    // did I already target this cell?
    if(attackInfo.hitType === HitType.NULL) {
      // is there anything in memory?
      if(this.memory.length > 0) {
        this.memory[0].orientation = orientation;
      }

      this.attack();
    } else {
      // did I destroy a ship?
      if(attackInfo.hitType === HitType.DESTROYED) {
        // remove ship from memory.
        const index = this.memory.findIndex(memory => memory.shipId === attackInfo.shipId);
        this.memory.splice(index, 1);

        // end turn;
        return;
      }

      // did I hit a ship?
      if(attackInfo.hitType === HitType.HIT) {
        const memory = this.memory.find(mem => mem.shipId === attackInfo.shipId);

        // have I hit this ship before?
        if(memory) {
          // save the additional coordinates.
          memory.coordinates.push({ row: row, col: col });
          memory.orientation = orientation;

          memory.coordinates = this.sortCoordinates(memory.coordinates, orientation);
        } else {
          // save the new ship in memory.
          this.memory.push({
            shipId: attackInfo.shipId,
            lastAttack: attackInfo,
            orientation: orientation,
            coordinates: [
              { row: row, col: col }
            ]
          });
        }
      } else {
        // is there anything in memory?
        if(this.memory.length > 0) {
          this.memory[0].orientation = orientation;
        }
      }
    }
  }

  /**
   * Rotates orientation of attack.
   *
   * @param orientation {@link Orientation}: The current orientation.
   */
  private rotateOrientation(orientation): Orientation {
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

  /**
   * Checks if the target is within the bounds of the board.
   *
   * @param row number: The current row.
   * @param col number: The current column.
   */
  private checkCoordinates(row: number, col: number) {
    const max = this.board.dimensions - 1;
    return ((row >= 0 && row <= max) && (col >= 0 && col <= max));
  }

  /**
   * Checks if there are any valid cells around the current cell.
   *
   * @param row number: The current row.
   * @param col number: The current column.
   * @returns the coordinates of the valid cell. <code>null</code> if there are no valid cells
   */
  private checkSurroundingCells(row: number, col: number): Coordinate {
    // check up
    row -= 1;
    if(this.board.getCellInfo(row, col, PlayerType.AI)) {
      return { row, col };
    }
    row +=1;

    // check right
    col += 1;
    if(this.board.getCellInfo(row, col, PlayerType.AI)) {
      return { row, col };
    }
    col -= 1;

    // check down
    row += 1;
    if(this.board.getCellInfo(row, col, PlayerType.AI)) {
      return { row, col };
    }
    row -= 1;

    // check left
    col -= 1;
    if(this.board.getCellInfo(row, col, PlayerType.AI)) {
      return { row, col };
    }
    col += 1;

    return null;
  }

  /**
   * Sorts the coordinates
   *
   * @param coordinates {@link Coordinate}[]: The coordinates to sort.
   * @param orientation {@link Orientation}: The orientation of attack.
   * @returns The sorted coordinates.
   */
  private sortCoordinates(coordinates: Coordinate[], orientation: Orientation): Coordinate[] {
    coordinates.sort((a, b) => {
      switch(orientation) {
        case Orientation.UP:
          if(a.row < b.row) {
            return 1;
          }

          if(a.row > b.row) {
            return -1;
          }

          return 0;
        case Orientation.RIGHT:
          if(a.col < b.col) {
            return -1;
          }

          if(a.col > b.col) {
            return 1;
          }

          return 0;
        case Orientation.DOWN:
          if(a.row < b.row) {
            return -1;
          }

          if(a.row > b.row) {
            return 1;
          }

          return 0;
        case Orientation.LEFT:
          if(a.col < b.col) {
            return 1;
          }

          if(a.col > b.col) {
            return -1;
          }

          return 0;
      }
    });

    return coordinates;
  }
}
