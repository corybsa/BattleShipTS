import {Ship} from './ship.model';

export interface ShipPosition {
  ship: Ship;
  coordinates: ShipPositionCoordinate[];
}

interface ShipPositionCoordinate {
  row: number;
  col: number;
}
