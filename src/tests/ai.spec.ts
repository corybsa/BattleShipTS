import { async, TestBed } from '@angular/core/testing';
import { AI } from '../app/classes/ai.model';
import { AppComponent } from '../app/app.component';
import { HitType } from '../app/classes/hit-info.model';
import { Orientation } from '../app/classes/orientation.model';
import { Ship } from '../app/classes/ship.model';
import { ShipTypes } from '../app/classes/ship-types.model';

describe('AI', () => {
  let app;
  let aiMemory;
  let aiShips = [];
  let aiShipPositions = [];
  const patrolBoat = new Ship(ShipTypes.PATROL_BOAT);
  const destroyer = new Ship(ShipTypes.DESTROYER);
  const submarine = new Ship(ShipTypes.SUBMARINE);
  const battleship = new Ship(ShipTypes.BATTLESHIP);
  const aircraftCarrier = new Ship(ShipTypes.AIRCRAFT_CARRIER);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();

    aiShips = [
      patrolBoat,
      destroyer,
      submarine,
      battleship,
      aircraftCarrier
    ];

    aiShipPositions = [
      {
        ship: patrolBoat,
        coordinates: [
          { col: 0, row: 0 },
          { col: 0, row: 1 },
        ]
      },
      {
        ship: destroyer,
        coordinates: [
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 }
        ]
      },
      {
        ship: submarine,
        coordinates: [
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 }
        ]
      },
      {
        ship: battleship,
        coordinates: [
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 }
        ]
      },
      {
        ship: aircraftCarrier,
        coordinates: [
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 },
          { col: 0, row: 0 }
        ]
      }
    ];

    aiMemory = [
      {
        coordinates: [
          { col: 0, row: 0 }
        ],
        lastAttack: {
          shipId: 0,
          hitType: HitType.NULL
        },
        orientation: Orientation.DOWN,
        shipId: 0
      }
    ];

    app.ai.memory = aiMemory;
    app.aiShips = aiShips;
    app.aiShipPositions = aiShipPositions;
  });

  it('should set memory', () => {
    expect(app.ai.memory).toEqual(aiMemory);
  });

  it('should set ships', () => {
    expect(app.aiShips).toEqual(aiShips);
  });

  it('should set ship positions', () => {
    expect(app.aiShipPositions).toEqual(aiShipPositions);
  });
});
