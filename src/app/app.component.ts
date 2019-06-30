import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Ship} from './classes/ship.model';
import {PlayerType} from './classes/player-type.model';
import {ShipPosition} from './classes/ship-position.model';
import {AI} from './classes/ai.model';
import {Gameboard} from './classes/gameboard.model';

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
  protected aiBoard: Gameboard;
  protected aiShips: Ship[] = [];
  protected aiShipPositions: ShipPosition[] = [];
  protected aiScore = 0;
  protected aiMisses = 0;

  /*@ViewChild('aiBoard') aiBoard: ElementRef;
  @ViewChild('playerBoard') playerBoard: ElementRef;
  @ViewChild('aiSideCoordinates') aiSideCoordinates: ElementRef;
  @ViewChild('aiTopCoordinates') aiTopCoordinates: ElementRef;
  @ViewChild('aiOutput') aiOutput: ElementRef;
  @ViewChild('playerOutput') playerOutput: ElementRef;*/

  constructor() {
    this.ai = new AI(this);
    this.aiBoard = new Gameboard(10);
  }

  ngAfterViewInit() {

  }

  /**
   * Highlights the row number on the side and the column number at the top.
   *
   * @param row number: The row that is being hovered over.
   * @param col number: The column that is being hovered over.
   */
  private highlight(row: number, col: number) {
    /*this.aiSideCoordinates.nativeElement.children[row].classList.add('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.add('highlight');*/
  }

  /**
   * Removed the highlight from the row number on the side and the column number at the top.
   *
   * @param row number: The row that is being hovered over.
   * @param col number: The column that is being hovered over.
   */
  private unhighlight(row: number, col: number) {
    /*this.aiSideCoordinates.nativeElement.children[row].classList.remove('highlight');
    this.aiTopCoordinates.nativeElement.children[col].classList.remove('highlight');*/
  }
}
