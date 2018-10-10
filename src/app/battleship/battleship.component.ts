import {AfterContentInit, Component, ContentChild, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'castle-battleship',
  styleUrls: ['./battleship.component.css'],
  templateUrl: './battleship.component.html'
})
export class BattleshipComponent implements AfterContentInit {
  dimensions = 10;
  boardRows = [];

  @ViewChild('aiBoard') aiBoard: ElementRef;
  @ViewChild('playerBoard') playerBoard: ElementRef;
  @ViewChild('aiSideCoordinates') aiSideCoordinates: ElementRef;
  @ViewChild('aiTopCoordinates') aiTopCoordinates: ElementRef;

  constructor() {
    this.boardRows = Array(this.dimensions).fill(0).map((x, i) => i);
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
}
