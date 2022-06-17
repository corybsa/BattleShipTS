import { Board } from "../board/board";
import { HitType } from '../board/hit-type';
import { ShipDirection } from "../ship/ship-direction.enum";
import { AI } from "./ai";

describe('AI Model', () => {
    let board: Board;
    let ai: AI;

    beforeEach(() => {
        board = new Board(10, 10);
        ai = new AI(board);
    });

    describe('attack', () => {
        it('should save successful hit', () => {
            (<any>ai).lastHit = null;
            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.HIT);
            
            ai.attack();
            expect((<any>ai).lastHit).not.toBeNull();
            expect((<any>ai).firstHit).not.toBeNull();
        });
        
        it('should save last hit', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.HIT);
            
            ai.attack();
            expect((<any>ai).lastHit).toEqual({ row: 3, col: 4, dir: ShipDirection.UP });
        });
        
        it('should clear memory after destroying a ship', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.DESTROY);
            
            ai.attack();
            expect((<any>ai).lastHit).toBeNull();
            expect((<any>ai).firstHit).toBeNull();
            expect((<any>ai).nextHit).toBeNull();
        });

        it('should first try the cell directly above after a successful hit', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: null };

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.HIT);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 3, col: 4, dir: ShipDirection.UP });
        });

        it('should try the cell directly right after a hit, miss', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).nextHit = { row: 4, col: 4, dir: ShipDirection.RIGHT };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.MISS);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 4, col: 4, dir: ShipDirection.DOWN });
        });

        it('should try the cell directly down after a hit, miss, miss', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).nextHit = { row: 4, col: 4, dir: ShipDirection.DOWN };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.MISS);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 4, col: 4, dir: ShipDirection.LEFT });
        });

        it('should try the cell directly left after a hit, miss, miss, miss', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).nextHit = { row: 4, col: 4, dir: ShipDirection.LEFT };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.HIT);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 4, col: 3, dir: ShipDirection.LEFT });
        });

        it('should continue in a direction after multiple hits in a row', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 4, col: 4, dir: ShipDirection.UP };
            (<any>ai).hitCount = 1;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.HIT);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 3, col: 4, dir: ShipDirection.UP });
            
            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 2, col: 4, dir: ShipDirection.UP });
        });

        it('should go back to the first cell and reverse direction when missing after multiple hits', () => {
            (<any>ai).firstHit = { row: 4, col: 4 };
            (<any>ai).lastHit = { row: 5, col: 4, dir: ShipDirection.DOWN };
            (<any>ai).nextHit = { row: 5, col: 4, dir: ShipDirection.DOWN };
            (<any>ai).hitCount = 2;

            (<any>ai).playerBoard.slotClick = jasmine.createSpy().and.returnValue(HitType.MISS);

            ai.attack();
            expect((<any>ai).nextHit).toEqual({ row: 4, col: 4, dir: ShipDirection.UP });
        });
    });

    describe('checkBoundaries', () => {
        it('should tell ai to go up', () => {
            let dir: ShipDirection = (<any>ai).checkBoundaries(4, 4, ShipDirection.UP);
            expect(dir).toEqual(ShipDirection.UP);

            dir = (<any>ai).checkBoundaries(1, 0, ShipDirection.LEFT);
            expect(dir).toEqual(ShipDirection.UP);
        });

        it('should tell ai to go right', () => {
            let dir: ShipDirection = (<any>ai).checkBoundaries(4, 4, ShipDirection.RIGHT);
            expect(dir).toEqual(ShipDirection.RIGHT);

            dir = (<any>ai).checkBoundaries(0, 0, ShipDirection.UP);
            expect(dir).toEqual(ShipDirection.RIGHT);
        });

        it('should tell ai to go down', () => {
            let dir: ShipDirection = (<any>ai).checkBoundaries(4, 4, ShipDirection.DOWN);
            expect(dir).toEqual(ShipDirection.DOWN);

            dir = (<any>ai).checkBoundaries(0, 9, ShipDirection.RIGHT);
            expect(dir).toEqual(ShipDirection.DOWN);
        });

        it('should tell ai to go left', () => {
            let dir: ShipDirection = (<any>ai).checkBoundaries(4, 4, ShipDirection.LEFT);
            expect(dir).toEqual(ShipDirection.LEFT);

            dir = (<any>ai).checkBoundaries(9, 9, ShipDirection.DOWN);
            expect(dir).toEqual(ShipDirection.LEFT);
        });
    });
});
