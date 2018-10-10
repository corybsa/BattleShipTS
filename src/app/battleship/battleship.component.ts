import {AfterContentInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Ship} from './classes/ship.model';

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
    this.boardRows = Array(this.dimensions).fill(0).map((x, i) => i);

    this.playerShips.push(
      new Ship(2, 'patrol-boat'),
      new Ship(3, 'destroyer'),
      new Ship(4, 'submarine'),
      new Ship(4, 'battleship'),
      new Ship(5, 'aircraft-carrier')
    );

    this.aiShips.push(
      new Ship(2, 'patrol-boat'),
      new Ship(3, 'destroyer'),
      new Ship(4, 'submarine'),
      new Ship(4, 'battleship'),
      new Ship(5, 'aircraft-carrier')
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
