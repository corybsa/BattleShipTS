export interface ShipType {
  health: number;
  size: number;
  name: string;
  identifier: number;
}

export class ShipTypes {
  static PATROL_BOAT: ShipType = {
    health: 2,
    size: 2,
    name: 'Patrol Boat',
    identifier: 1
  };
  static DESTROYER: ShipType = {
    health: 3,
    size: 3,
    name: 'Destroyer',
    identifier: 2
  };
  static SUBMARINE: ShipType = {
    health: 4,
    size: 4,
    name: 'Submarine',
    identifier: 3
  };
  static BATTLESHIP: ShipType = {
    health: 4,
    size: 4,
    name: 'Battleship',
    identifier: 4
  };
  static AIRCRAFT_CARRER: ShipType = {
    health: 5,
    size: 5,
    name: 'Aircraft Carrer',
    identifier: 5
  };
}
