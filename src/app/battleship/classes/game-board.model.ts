export class GameBoard {
  private dimensions: number;

  constructor(dimensions?: number) {
    if(dimensions) {
      this.dimensions = dimensions;
    } else {
      this.dimensions = 10;
    }
  }

  generateBoard() {

  }
}
