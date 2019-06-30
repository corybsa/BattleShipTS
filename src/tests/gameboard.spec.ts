import {Gameboard} from '../app/classes/gameboard.model';
import {ShipTypes} from '../app/classes/ship-types.model';
import {Ship} from '../app/classes/ship.model';
import {Orientation} from '../app/classes/orientation.model';

describe('Gameboard', () => {
  let gameboard: Gameboard;

  it('should create a Gameboard', () => {
    gameboard = new Gameboard(10);
    gameboard.clearBoard();
    expect(gameboard).toBeTruthy();
  });

  it('should have patrol boat at { (0, 0), (0, 1) }', () => {
    const patrolBoat = new Ship(ShipTypes.PATROL_BOAT);
    patrolBoat.orientation = Orientation.DOWN;
    gameboard.placeShip(patrolBoat, 0, 0);

    const boardPatrolBoat = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if (cell.ship.identifier === ShipTypes.PATROL_BOAT.identifier) {
          return cell;
        }
      }
    });

    expect(boardPatrolBoat.length).toEqual(ShipTypes.PATROL_BOAT.size);

    const ship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if(cell.ship.identifier === ShipTypes.PATROL_BOAT.identifier) {
          return cell;
        }
      }
    });

    expect(ship[0].row).toEqual(0);
    expect(ship[0].col).toEqual(0);

    expect(ship[1].row).toEqual(1);
    expect(ship[1].col).toEqual(0);
  });

  it('should have destroyer at { (0, 1), (0, 2), (0, 3) }', () => {
    const destroyer = new Ship(ShipTypes.DESTROYER);
    destroyer.orientation = Orientation.RIGHT;
    gameboard.placeShip(destroyer, 0, 1);

    const boardDestroyer = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if (cell.ship.identifier === ShipTypes.DESTROYER.identifier) {
          return cell;
        }
      }
    });

    expect(boardDestroyer.length).toEqual(ShipTypes.DESTROYER.size);

    const ship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if(cell.ship.identifier === ShipTypes.DESTROYER.identifier) {
          return cell;
        }
      }
    });

    expect(ship[0].row).toEqual(0);
    expect(ship[0].col).toEqual(1);

    expect(ship[1].row).toEqual(0);
    expect(ship[1].col).toEqual(2);

    expect(ship[2].row).toEqual(0);
    expect(ship[2].col).toEqual(3);
  });

  it('should have submarine at { (3, 3), (4, 3), (5, 3) }', () => {
    const submarine = new Ship(ShipTypes.SUBMARINE);
    submarine.orientation = Orientation.DOWN;
    gameboard.placeShip(submarine, 3, 3);

    const boardSubmarine = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if (cell.ship.identifier === ShipTypes.SUBMARINE.identifier) {
          return cell;
        }
      }
    });

    expect(boardSubmarine.length).toEqual(ShipTypes.SUBMARINE.size);

    const ship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if(cell.ship.identifier === ShipTypes.SUBMARINE.identifier) {
          return cell;
        }
      }
    });

    expect(ship[0].row).toEqual(3);
    expect(ship[0].col).toEqual(3);

    expect(ship[1].row).toEqual(4);
    expect(ship[1].col).toEqual(3);

    expect(ship[2].row).toEqual(5);
    expect(ship[2].col).toEqual(3);
  });

  it('should have battleship at { (3, 6), (4, 6), (5, 6), (6, 6) }', () => {
    const battleship = new Ship(ShipTypes.BATTLESHIP);
    battleship.orientation = Orientation.UP;
    gameboard.placeShip(battleship, 6, 6);

    const boardBattleship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if (cell.ship.identifier === ShipTypes.BATTLESHIP.identifier) {
          return cell;
        }
      }
    });

    expect(boardBattleship.length).toEqual(ShipTypes.BATTLESHIP.size);

    const ship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if(cell.ship.identifier === ShipTypes.BATTLESHIP.identifier) {
          return cell;
        }
      }
    });

    expect(ship[0].row).toEqual(3);
    expect(ship[0].col).toEqual(6);

    expect(ship[1].row).toEqual(4);
    expect(ship[1].col).toEqual(6);

    expect(ship[2].row).toEqual(5);
    expect(ship[2].col).toEqual(6);

    expect(ship[3].row).toEqual(6);
    expect(ship[3].col).toEqual(6);
  });

  it('should have aircraft carrier at { (7, 2), (7, 3), (7, 4), (7, 5), (7, 6) }', () => {
    const aircraftCarrier = new Ship(ShipTypes.AIRCRAFT_CARRIER);
    aircraftCarrier.orientation = Orientation.LEFT;
    gameboard.placeShip(aircraftCarrier, 7, 6);

    const boardAircraftCarrier = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if (cell.ship.identifier === ShipTypes.AIRCRAFT_CARRIER.identifier) {
          return cell;
        }
      }
    });

    expect(boardAircraftCarrier.length).toEqual(ShipTypes.AIRCRAFT_CARRIER.size);

    const ship = gameboard.board.cells.filter(cell => {
      if(cell.ship) {
        if(cell.ship.identifier === ShipTypes.AIRCRAFT_CARRIER.identifier) {
          return cell;
        }
      }
    });

    expect(ship[0].row).toEqual(7);
    expect(ship[0].col).toEqual(2);

    expect(ship[1].row).toEqual(7);
    expect(ship[1].col).toEqual(3);

    expect(ship[2].row).toEqual(7);
    expect(ship[2].col).toEqual(4);

    expect(ship[3].row).toEqual(7);
    expect(ship[3].col).toEqual(5);

    expect(ship[4].row).toEqual(7);
    expect(ship[4].col).toEqual(6);
  });
});
