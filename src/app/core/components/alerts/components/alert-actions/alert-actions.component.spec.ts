import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertActionsComponent } from './alert-actions.component';

describe('AlertActionsComponent', () => {
  let component: AlertActionsComponent;
  let fixture: ComponentFixture<AlertActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
