import {Ship} from './ship.model';
import {PlayerType} from './player-type.model';
import {ShipTypes} from './ship-types.model';
import {ShipPosition} from './ship-position.model';
import {Orientation} from './orientation.model';
import {HitInfo, HitType} from './hit-info.model';

interface Board {
  cells: {
    col: number,
    row: number,
    hitInfo: HitInfo
  }[];
}

export class Gameboard {
  private readonly dimensions: number;
  private board: Board;
  private playerType: PlayerType;
  private ships: Ship[];
  private shipPositions: ShipPosition[];

  constructor(dimens: number, playerType: PlayerType) {
    this.dimensions = dimens;
    this.playerType = playerType;

    this.ships.push(
      new Ship(ShipTypes.PATROL_BOAT),
      new Ship(ShipTypes.DESTROYER),
      new Ship(ShipTypes.SUBMARINE),
      new Ship(ShipTypes.BATTLESHIP),
      new Ship(ShipTypes.AIRCRAFT_CARRIER)
    );

    this.placeShips();
  }

  private initBoard() {
    this.board = {
      cells: []
    };

    for(let row = 0; row < this.dimensions; row++) {
      for(let col = 0; col < this.dimensions; col++) {
        this.board.cells.push({
          row: row,
          col: col,
          hitInfo: {shipId: ShipTypes.NULL.identifier, hitType: HitType.NULL}
        });
      }
    }
  }

  /**
   * Places the ship on the board.
   */
  private placeShips() {
    for(const ship of this.ships) {
      let row = Math.floor(Math.random() * this.dimensions);
      let col = Math.floor(Math.random() * this.dimensions);

      while (!this.checkPlacement(ship, row, col)) {
        row = Math.floor(Math.random() * this.dimensions);
        col = Math.floor(Math.random() * this.dimensions);
      }

      for(let i = 0; i < ship.size; i++) {
        this.shipPositions
          .find(item => item.ship.identifier === ship.identifier)
          .coordinates
          .push({ row, col });

        switch(ship.orientation) {
          case Orientation.UP:
            row += 1;
            break;
          case Orientation.RIGHT:
            col += 1;
            break;
          case Orientation.DOWN:
            row -= 1;
            break;
          case Orientation.LEFT:
            col -= 1;
            break;
        }
      }
    }
  }

  /**
   * Checks if the ship is going to overlap another ship or if the ship is going to be placed outside
   * of the board.
   *
   * @param ship {@link Ship}: The ship being placed.
   * @param row number: The row the ship is being placed on.
   * @param col number: The column the ship is being placed on.
   * @returns true if the ship is not going to overlap another ship, false if it will.
   */
  private checkPlacement(ship: Ship, row: number, col: number): boolean {
    for(let i = 0; i < ship.size; i++) {
      switch (ship.orientation) {
        case Orientation.UP:
          row += 1;
          break;
        case Orientation.RIGHT:
          col += 1;
          break;
        case Orientation.DOWN:
          row -= 1;
          break;
        case Orientation.LEFT:
          col -= 1;
          break;
      }

      // check for out of bounds error
      if(row < 0 || row >= this.dimensions) {
        return false;
      }

      if(col < 0 || col >= this.dimensions) {
        return false;
      }

      for(const position of this.shipPositions) {
        const cell = position.coordinates.find(item => {
          return item.col === col && item.row === row;
        });

        if(cell) {
          return false;
        }
      }
    }

    return true;
  }

  private checkCell(row: number, col: number): HitInfo {
    let info: HitInfo;
    const boardCell = this.board.cells.find(item => {
      if(item.hitInfo.hitType === HitType.MISS || item.hitInfo.hitType === HitType.HIT) {
        return true;
      }
    });

    if(boardCell) {
      return {
        shipId: ShipTypes.NULL.identifier,
        hitType: HitType.NULL
      };
    }

    const position = this.shipPositions.find(item => {
      const coordinate = item.coordinates.find(coord => {
        if(coord.row === row && coord.col === col) {
          return true;
        }
      });

      return !!coordinate;
    });

    if(position) {
      // TODO: implement this method.
      this.shipHit(position.ship, row, col);

      if(position.ship.isDestroyed()) {
        info = {
          shipId: position.ship.identifier,
          hitType: HitType.DESTROYED
        };
      } else {
        info = {
          shipId: position.ship.identifier,
          hitType: HitType.HIT
        };
      }
    } else {
      // TODO: implement this method.
      this.shipMissed(position.ship, row, col);
      info = {
        shipId: ShipTypes.NULL.identifier,
        hitType: HitType.MISS
      };
    }

    // TODO: this is where the ai is allowed to attack. Need to figure out the best way to do that.

    return info;
  }

  private shipHit(ship: Ship, row: number, col: number) {

  }

  private shipMissed(ship: Ship, row: number, col: number) {

  }

  /**
   * Return ship positions.
   */
  public getShipPositions() {
    return this.shipPositions;
  }
}
