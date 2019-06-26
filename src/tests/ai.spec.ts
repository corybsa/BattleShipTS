import { async, TestBed } from '@angular/core/testing';
import { AI } from '../app/classes/ai.model';
import { AppComponent } from '../app/app.component';
import { HitType } from '../app/classes/hit-info.model';
import { Orientation } from '../app/classes/orientation.model';

describe('AI', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create ai', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    app.ai.memory = [{
      coordinates: [{col: 1, row: 1}],
      lastAttack: {shipId: 0, hitType: HitType.HIT},
      orientation: Orientation.DOWN,
      shipId: 0
    }];

    expect(app.ai.memory).toEqual([{
      coordinates: [{col: 1, row: 1}],
      lastAttack: {shipId: 0, hitType: HitType.HIT},
      orientation: Orientation.DOWN,
      shipId: 0
    }]);
  });
});
