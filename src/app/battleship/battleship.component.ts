import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'castle-battleship',
  styleUrls: ['./battleship.component.css'],
  templateUrl: './battleship.component.html'
})
export class BattleshipComponent implements AfterContentInit {
  dimensions = 10;

  @ViewChild('aiBoard') aiBoard: HTMLTableElement;
  @ViewChild('playerBoard') playerBoard: HTMLTableElement;

  constructor() {

  }

  ngAfterContentInit() {
    this.generateBoard(this.aiBoard);
  }

  generateBoard(board: HTMLTableElement) {
    console.log(board);
  }
}
