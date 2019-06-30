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

  /**
   * Checks if the cell contains a ship or not. If it does then damage the ship. It it doesn't then
   * tell the player they missed.
   * @param row number: The row that was targeted.
   * @param col number: The column that was targeted.
   */
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
      this.shipMissed(row, col);
      info = {
        shipId: ShipTypes.NULL.identifier,
        hitType: HitType.MISS
      };
    }

    return info;
  }

  /**
   * The attack was a hit. Tell the ship to take damage, and mark the cell on the board as a hit.
   * @param ship {@link Ship}: The ship that is being targeted.
   * @param row number: The row that was targeted.
   * @param col number: The column that was targeted.
   */
  private shipHit(ship: Ship, row: number, col: number) {
    ship.takeDamage();

    for(const cell of this.board.cells) {
      if(cell.row === row && cell.col === col) {
        cell.hitInfo.hitType = HitType.HIT;
        return;
      }
    }
  }

  /**
   * The attack was a miss. Mark the cell on the board as a miss.
   * @param row number: The row that was targeted.
   * @param col number: The column that was targeted.
   */
  private shipMissed(row: number, col: number) {
    for(const cell of this.board.cells) {
      if(cell.row === row && cell.col === col) {
        cell.hitInfo.hitType = HitType.MISS;
        return;
      }
    }
  }

  /**
   * Return ship positions.
   */
  public getShipPositions() {
    return this.shipPositions;
  }

  /**
   * Checks if the cell has been targeted before.
   * @param row number: The row that is being targeted.
   * @param col number: The col that is being targeted.
   * @returns <code>true</code> if the cell hasn't been targeted. <code>false</code> if the cell has been targeted.
   */
  public getCellInfo(row: number, col: number): boolean {
    const target = this.board.cells.find(cell => {
      if(cell.row === row && cell.col === col) {
        return true;
      }
    });

    if(target === undefined) {
      return false;
    }

    if(target.hitInfo.hitType === HitType.MISS || target.hitInfo.hitType === HitType.HIT) {
      return false;
    }

    return true;
  }
}
