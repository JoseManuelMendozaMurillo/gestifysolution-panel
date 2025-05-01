import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertTitleComponent } from './alert-title.component';

describe('AlertTitleComponent', () => {
  let component: AlertTitleComponent;
  let fixture: ComponentFixture<AlertTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
