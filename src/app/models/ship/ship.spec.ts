import { Ship } from './ship';
import { ShipDirection } from './ship-direction.enum';
import { ShipType } from './ship-type';

describe('Ship', () => {
  it('should create an instance', () => {
    expect(new Ship(ShipType.Battleship, ShipDirection.UP)).toBeTruthy();
  });
});
