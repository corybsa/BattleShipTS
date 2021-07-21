import { Component, OnInit } from '@angular/core';
import { AI } from 'src/app/models/ai/ai';
import { Board } from 'src/app/models/board/board';
import { BoardSlotStatus } from 'src/app/models/board/board-slot-status.enum';
import { HitType } from 'src/app/models/board/hit-type';
import { ShipDirection } from 'src/app/models/ship/ship-direction.enum';
import { ShipType } from 'src/app/models/ship/ship-type';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  playerBoard = new Board(10, 10);
  aiBoard = new Board(10, 10);
  ai = new AI(this.playerBoard);
  slotStatus = BoardSlotStatus;

  constructor() {
    
  }

  ngOnInit(): void {
    this.playerBoard.showHints = true;
    this.playerBoard.placeShip(ShipType.Destroyer, ShipDirection.UP, 0, 0);
    this.playerBoard.placeShip(ShipType.Submarine, ShipDirection.RIGHT, 0, 0);
    this.playerBoard.placeShip(ShipType.Cruiser, ShipDirection.DOWN, 0, 0);
    this.playerBoard.placeShip(ShipType.Battleship, ShipDirection.LEFT, 0, 0);
    this.playerBoard.placeShip(ShipType.Carrier, ShipDirection.UP, 0, 0);

    this.aiBoard.showHints = true;
    this.aiBoard.placeShip(ShipType.Destroyer, ShipDirection.UP, 0, 0);
    this.aiBoard.placeShip(ShipType.Submarine, ShipDirection.RIGHT, 0, 0);
    this.aiBoard.placeShip(ShipType.Cruiser, ShipDirection.DOWN, 0, 0);
    this.aiBoard.placeShip(ShipType.Battleship, ShipDirection.LEFT, 0, 0);
    this.aiBoard.placeShip(ShipType.Carrier, ShipDirection.UP, 0, 0);
    
  }

  slotClicked(row: number, col: number) {
    if(this.aiBoard.slotClick(row, col) !== HitType.ERROR) {
      // let the ai target the player
      this.ai.attack();
    }
  }
}
