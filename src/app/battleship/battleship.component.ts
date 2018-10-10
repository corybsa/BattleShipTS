import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'castle-battleship',
  styleUrls: ['./battleship.component.css'],
  templateUrl: './battleship.component.html'
})
export class BattleshipComponent implements AfterContentInit {
  dimensions = 10;
  boardRows = [];

  @ViewChild('aiBoard') aiBoard: HTMLTableElement;
  @ViewChild('playerBoard') playerBoard: HTMLTableElement;

  constructor() {
    this.boardRows = Array(this.dimensions).fill(0).map((x, i) => i);
  }

  ngAfterContentInit() {
    this.generateBoard(this.aiBoard);
  }

  generateBoard(board: HTMLTableElement) {
    console.log(board);
  }
}
