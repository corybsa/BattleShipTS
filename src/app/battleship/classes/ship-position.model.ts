import {Ship} from './ship.model';

/**
 * @property ship {@link Ship}: The ship.
 * @property coordinates {@link ShipPositionCoordinate}: The individual coordinates of the ship.
 */
export interface ShipPosition {
  ship: Ship;
  coordinates: ShipPositionCoordinate[];
}

/**
 * @property row number: The row of the ship.
 * @property col number: The col of the ship.
 */
export interface ShipPositionCoordinate {
  row: number;
  col: number;
}
