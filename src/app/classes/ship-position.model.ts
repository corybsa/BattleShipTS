import {Ship} from './ship.model';

/**
 * @property ship {@link Ship}: The ship.
 * @property coordinates {@link Coordinate}: The individual coordinates of the ship.
 */
export interface ShipPosition {
  ship: Ship;
  coordinates: Coordinate[];
}

/**
 * @property row number: The row of the ship.
 * @property col number: The col of the ship.
 */
export interface Coordinate {
  row: number;
  col: number;
}
