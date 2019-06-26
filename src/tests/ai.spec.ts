import { async, TestBed } from '@angular/core/testing';
import { AI } from '../app/classes/ai.model';
import { AppComponent } from '../app/app.component';

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

    expect(app.ai).toBeTruthy();
  });
});
