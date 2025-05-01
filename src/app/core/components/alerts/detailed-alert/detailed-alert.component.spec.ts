import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedAlertComponent } from './detailed-alert.component';

describe('DetailedAlertComponent', () => {
  let component: DetailedAlertComponent;
  let fixture: ComponentFixture<DetailedAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedAlertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
