import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Ship} from './classes/ship.model';
import {ShipTypes} from './classes/ship-types.model';

@Component({
  selector: 'castle-battleship',
  styleUrls: ['./battleship.component.css'],
  templateUrl: './battleship.component.html'
})
export class BattleshipComponent implements AfterContentInit {
  dimensions = 10;
  boardRows = [];
  playerShips: Ship[] = [];
  aiShips: Ship[] = [];

  @ViewChild('aiBoard') aiBoard: ElementRef;
  @ViewChild('playerBoard') playerBoard: ElementRef;
  @ViewChild('aiSideCoordinates') aiSideCoordinates: ElementRef;
  @ViewChild('aiTopCoordinates') aiTopCoordinates: ElementRef;

  constructor() {
    this.boardRows = Array(this.dimensions).map((x, i) => i);

    this.playerShips.push(
      new Ship(ShipTypes.PATROL_BOAT),
      new Ship(ShipTypes.DESTROYER),
      new Ship(ShipTypes.SUBMARINE),
      new Ship(ShipTypes.BATTLESHIP),
      new Ship(ShipTypes.AIRCRAFT_CARRER)
    );

    this.aiShips.push(
      new Ship(ShipTypes.PATROL_BOAT),
      new Ship(ShipTypes.DESTROYER),
      new Ship(ShipTypes.SUBMARINE),
      new Ship(ShipTypes.BATTLESHIP),
      new Ship(ShipTypes.AIRCRAFT_CARRER)
    );
  }

  ngAfterContentInit() {

  }

  highlight(row, col) {
    this.aiSideCoordinates.nativeElement.childNodes[row].classList.add('highlight');
    this.aiTopCoordinates.nativeElement.childNodes[col].classList.add('highlight');
  }

  unhighlight(row, col) {
    this.aiSideCoordinates.nativeElement.childNodes[row].classList.remove('highlight');
    this.aiTopCoordinates.nativeElement.childNodes[col].classList.remove('highlight');
  }

  checkCell(row, col) {

  }

  placeShips() {

  }

  checkBoundaries(row, col) {

  }
}
