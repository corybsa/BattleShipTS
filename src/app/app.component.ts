import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Ship} from './classes/ship.model';
import {ShipTypes} from './classes/ship-types.model';
import {PlayerType} from './classes/player-type.model';
import {Orientation} from './classes/orientation.model';
import {ShipPosition} from './classes/ship-position.model';
import {AI} from './classes/ai.model';
import {HitInfo, HitType} from './classes/hit-info.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  public dimensions = 10;
  protected playerType = PlayerType;
  protected boardRows = [];

  protected playerShips: Ship[] = [];
  protected playerShipPositions: ShipPosition[] = [];
  protected playerScore = 0;
  protected playerMisses = 0;

  protected ai: AI;
  protected aiShips: Ship[] = [];
  protected aiShipPositions: ShipPosition[] = [];
  protected aiScore = 0;
  protected aiMisses = 0;

  @ViewChild('aiBoard') aiBoard: ElementRef;
  @ViewChild('playerBoard') playerBoard: ElementRef;
  @ViewChild('aiSideCoordinates') aiSideCoordinates: ElementRef;
  @ViewChild('aiTopCoordinates') aiTopCoordinates: ElementRef;
  @ViewChild('aiOutput') aiOutput: ElementRef;
  @ViewChild('playerOutput') playerOutput: ElementRef;

  constructor() {
    this.ai = new AI(this);
    this.boardRows = Array(this.dimensions).fill(0).map((x, i) => i);

    this.playerShips.push(
      new Ship(ShipTypes.PATROL_BOAT),
      new Ship(ShipTypes.DESTROYER),
      new Ship(ShipTypes.SUBMARINE),
      new Ship(ShipTypes.BATTLESHIP),
      new Ship(ShipTypes.AIRCRAFT_CARRIER)
    );

    this.aiShips.push(
      new Ship(ShipTypes.PATROL_BOAT),
      new Ship(ShipTypes.DESTROYER),
      new Ship(ShipTypes.SUBMARINE),
      new Ship(ShipTypes.BATTLESHIP),
      new Ship(ShipTypes.AIRCRAFT_CARRIER)
    );
  }

  ngAfterViewInit() {
    for(const ship of this.playerShips) {
      this.placeShip(ship, PlayerType.PLAYER);
    }

    for(const ship of this.aiShips) {
      this.placeShip(ship, PlayerType.AI);
    }
  }

  /**
   * Highlights the row number on the side and the column number at the top.
   *
   * @param row number: The row that is being hovered over.
   * @param col number: The column that is being hovered over.
   */
  private highlight(row: number, col: number) {
    this.aiSideCoordinates.nativeElement.children[row].classList.add('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.add('highlight');
  }

  /**
   * Removed the highlight from the row number on the side and the column number at the top.
   *
   * @param row number: The row that is being hovered over.
   * @param col number: The column that is being hovered over.
   */
  private unhighlight(row: number, col: number) {
    this.aiSideCoordinates.nativeElement.children[row].classList.remove('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.remove('highlight');
  }

  /**
   * Places the ship on the board.
   *
   * @param ship {@link Ship}: The ship to place.
   * @param playerType {@link PlayerType}: Determines which board to place the ship on.
   */
  private placeShip(ship: Ship, playerType: PlayerType) {
    let row = Math.floor(Math.random() * this.dimensions);
    let col = Math.floor(Math.random() * this.dimensions);
    let board: ElementRef;

    if(playerType === PlayerType.PLAYER) {
      board = this.playerBoard;
      this.playerShipPositions.push({ ship: ship, coordinates: [] });
    } else {
      board = this.aiBoard;
      this.aiShipPositions.push({ ship: ship, coordinates: [] });
    }

    // check placement of ship until the ship can be placed properly on the board.
    while(!this.checkPlacement(ship, board, row, col)) {
      // re-roll the coordinates
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    for(let i = 0; i < ship.size; i++) {
      // keep track of the ships.
      if(playerType === PlayerType.PLAYER) {
        this.playerShipPositions
          .find(item => item.ship.identifier === ship.identifier)
          .coordinates
          .push({ row: row, col: col });
      } else {
        this.aiShipPositions
          .find(item => item.ship.identifier === ship.identifier)
          .coordinates
          .push({ row: row, col: col });
      }

      // place the ship on the board.
      board.nativeElement.children[0].children[row].children[col].setAttribute('ship', true);
      board.nativeElement.children[0].children[row].children[col].classList.add('hint');

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

  /**
   * Checks if the ship is going to overlap another ship or if the ship is going to be placed outside
   * of the board.
   *
   * @param ship {@link Ship}: The ship being placed.
   * @param board {@link ElementRef}: The element reference to the board.
   * @param row number: The row the ship is being placed on.
   * @param col number: The column the ship is being placed on.
   * @returns true if the ship is not going to overlap another ship, false if it will.
   */
  private checkPlacement(ship: Ship, board: ElementRef, row: number, col: number): boolean {
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

      const targetRow = board.nativeElement.children[0].children[row];

      // check that the row exists (eg. not an index out of bounds error.
      if(!targetRow) {
        return false;
      }

      const cell = targetRow.children[col];

      // check that the cell exists (eg. not an index out of bounds error).
      if(!cell) {
        return false;
      }

      // check if the cell has a ship in it.
      if(cell.getAttribute('ship')) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks if the cell contains a ship or not. If it does then damage the ship. It it doesn't then
   * tell the player they missed.
   *
   * @param row number: The row that was targeted.
   * @param col number: The column that was targeted.
   * @param attackingPlayerType {@link PlayerType}: The type of player that is attacking.
   */
  public checkCell(row: number, col: number, attackingPlayerType: PlayerType): HitInfo {
    let positions: ShipPosition[];
    let info: HitInfo;
    let board;

    if(attackingPlayerType === PlayerType.PLAYER) {
      board = this.aiBoard;
      positions = this.aiShipPositions;
    } else {
      board = this.playerBoard;
      positions = this.playerShipPositions;
    }

    const target = board.nativeElement.children[0].children[row].children[col];

    if(target.classList.contains('miss') || target.classList.contains('hit')) {
      return {
        shipId: null,
        hitType: HitType.NULL
      };
    }

    const cell = positions.find(item => {
      const coordinate = item.coordinates.find(coord => coord.row === row && coord.col === col);

      return !!coordinate;
    });

    if(cell) {
      this.shipHit(cell.ship, row, col, attackingPlayerType);

      if(cell.ship.isDestroyed()) {
        info = {
          shipId: cell.ship.identifier,
          hitType: HitType.DESTROYED
        };
      } else {
        info = {
          shipId: cell.ship.identifier,
          hitType: HitType.HIT
        };
      }
    } else {
      this.shipMissed(row, col, attackingPlayerType);
      info = {
        shipId: null,
        hitType: HitType.MISS
      };
    }

    if(attackingPlayerType === PlayerType.PLAYER) {
      this.ai.attack();
    }

    return info;
  }

  /**
   * Checks if cell has been targeted before.
   *
   * @param row number: The row that is being targeted.
   * @param col number: The column that is being targeted.
   * @param attackingPlayerType {@link PlayerType}: The type of player that is attacking.
   * @returns <code>true</code> if the cell hasn't been targeted. <code>false</code> if the cell has been targeted.
   */
  public getCellInfo(row: number, col: number, attackingPlayerType: PlayerType): boolean {
    let board;

    if(attackingPlayerType === PlayerType.PLAYER) {
      board = this.aiBoard;
    } else {
      board = this.playerBoard;
    }

    const target = board.nativeElement.children[0].children[row].children[col];

    if(target === undefined) {
      return false;
    }

    if(target.classList.contains('miss') || target.classList.contains('hit')) {
      return false;
    }

    return true;
  }

  /**
   * Damages the ship and informs the player if the ship was destroyed or not.
   *
   * @param ship {@link Ship}: The ship that is being targeted.
   * @param row number: The row that is being targeted.
   * @param col number: The column that is being targeted.
   * @param attackingPlayerType {@PlayerType}: The type of player that is attacking.
   */
  private shipHit(ship: Ship, row: number, col: number, attackingPlayerType: PlayerType) {
    if(!ship.isDestroyed()) {
      ship.takeDamage();

      if(attackingPlayerType === PlayerType.PLAYER) {
        if(!ship.isDestroyed()) {
          this.playerOutput.nativeElement.innerText = `You hit the enemy's ${ship.name}!`;
          this.playerScore += 1;
        } else {
          this.playerOutput.nativeElement.innerText = `You destroyed the enemy's ${ship.name}!`;
          this.playerScore += 2;
        }

        this.aiBoard.nativeElement.children[0].children[row].children[col].classList.add('hit');
      } else {
        if(!ship.isDestroyed()) {
          this.aiOutput.nativeElement.innerText = `You hit the enemy's ${ship.name}!`;
          this.aiScore += 1;
        } else {
          this.aiOutput.nativeElement.innerText = `You destroyed the enemy's ${ship.name}!`;
          this.aiScore += 2;
        }

        this.playerBoard.nativeElement.children[0].children[row].children[col].classList.add('hit');
      }
    }
  }

  /**
   * Informs the player that they missed.
   *
   * @param row number: The row that is being targeted.
   * @param col number: The column that is being targeted.
   * @param attackingPlayerType {@link PlayerType}: The type of player that is attacking.
   */
  private shipMissed(row: number, col: number, attackingPlayerType: PlayerType) {
    if(attackingPlayerType === PlayerType.PLAYER) {
      this.playerOutput.nativeElement.innerText = 'You missed!';
      this.playerMisses += 1;
      this.aiBoard.nativeElement.children[0].children[row].children[col].classList.add('miss');
    } else {
      this.aiOutput.nativeElement.innerText = 'You missed!';
      this.aiMisses += 1;
      this.playerBoard.nativeElement.children[0].children[row].children[col].classList.add('miss');
    }
  }
}
