import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Ship} from './classes/ship.model';
import {ShipTypes} from './classes/ship-types.model';
import {PlayerType} from './classes/player-type.model';
import {Orientation} from './classes/orientation.model';

@Component({
  selector: 'app-battleship',
  styleUrls: ['./battleship.component.css'],
  templateUrl: './battleship.component.html'
})
export class BattleshipComponent implements AfterViewInit {
  playerType = PlayerType;
  dimensions = 10;
  boardRows = [];

  playerShips: Ship[] = [];
  playerScore = 0;
  playerMisses = 0;

  aiShips: Ship[] = [];
  aiScore = 0;
  aiMisses = 0;


  @ViewChild('aiBoard') aiBoard: ElementRef;
  @ViewChild('playerBoard') playerBoard: ElementRef;
  @ViewChild('aiSideCoordinates') aiSideCoordinates: ElementRef;
  @ViewChild('aiTopCoordinates') aiTopCoordinates: ElementRef;
  @ViewChild('aiOutput') aiOutput: ElementRef;
  @ViewChild('playerOutput') playerOutput: ElementRef;

  constructor() {
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

  highlight(row: number, col: number) {
    this.aiSideCoordinates.nativeElement.children[row].classList.add('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.add('highlight');
  }

  unhighlight(row: number, col: number) {
    this.aiSideCoordinates.nativeElement.children[row].classList.remove('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.remove('highlight');
  }

  /**
   * Places the ship on the board.
   *
   * @param ship {@link Ship}: The ship to place.
   * @param playerType {@link PlayerType}: Determines which board to place the ship on.
   */
  placeShip(ship: Ship, playerType: PlayerType) {
    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let board: ElementRef;

    if(playerType === PlayerType.PLAYER) {
      board = this.playerBoard;
    } else {
      board = this.aiBoard;
    }

    // check placement of ship until the ship can be placed properly on the board.
    while(
      !this.checkPlacement(ship, board, row, col)
    ) {
      // re-roll the coordinates
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }

    for(let i = 0; i < ship.size; i++) {
      board.nativeElement.children[0].children[row].children[col].setAttribute('ship', ship.toJson());
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
  checkPlacement(ship: Ship, board: ElementRef, row: number, col: number): boolean {
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

      if(!targetRow) {
        return false;
      }

      const cell = targetRow.children[col];

      if(!cell) {
        return false;
      }

      // check that the cell exists (eg. not an index out of bounds error) and if the cell has a ship in it.
      if(cell.hasAttribute('ship')) {
        return false;
      }
    }

    return true;
  }

  checkCell(row: number, col: number, attackingPlayerType: PlayerType) {
    let board: ElementRef;

    if(attackingPlayerType === PlayerType.PLAYER) {
      board = this.aiBoard;
    } else {
      board = this.playerBoard;
    }

    const cell = board.nativeElement.children[0].children[row].children[col];

    if(cell.hasAttribute('ship')) {
      const ship: Ship = this.buildShip(JSON.parse(cell.getAttribute('ship')));
      this.shipHit(ship, attackingPlayerType);
    } else {
      this.shipMissed(attackingPlayerType);
    }
  }

  shipHit(ship: Ship, attackingPlayerType: PlayerType) {
    if(!ship.isDestroyed()) {
      ship.takeDamage();

      if(attackingPlayerType === PlayerType.PLAYER) {
        this.playerOutput.nativeElement.innerText = `You hit the enemy's ${ship.name}!`;
        this.playerScore += 1;
      } else {
        this.aiOutput.nativeElement.innerText = `You hit the enemy's ${ship.name}!`;
        this.aiScore += 1;
      }
    } else {
      if(attackingPlayerType === PlayerType.PLAYER) {
        this.playerOutput.nativeElement.innerText = `You destroyed the enemy's ${ship.name}!`;
        this.playerScore += 2;
      } else {
        this.aiOutput.nativeElement.innerText = `You destroyed the enemy's ${ship.name}!`;
        this.aiScore += 2;
      }
    }

    // TODO: update the cell with hit information
  }

  shipMissed(attackingPlayerType: PlayerType) {
    if(attackingPlayerType === PlayerType.PLAYER) {
      this.playerOutput.nativeElement.innerText = 'You missed!';
      this.playerMisses += 1;
    } else {
      this.aiOutput.nativeElement.innerText = 'You missed!';
      this.aiMisses += 1;
    }

    // TODO: update the cell with miss information
  }

  buildShip(ship: Ship): Ship {
    const newShip = new Ship(ShipTypes.NULL);
    newShip.size = ship.size;
    newShip.health = ship.health;
    newShip.name = ship.name;
    newShip.orientation = ship.orientation;

    return newShip;
  }
}
