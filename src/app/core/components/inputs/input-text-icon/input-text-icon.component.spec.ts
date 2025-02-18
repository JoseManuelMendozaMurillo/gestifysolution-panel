import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTextIconComponent } from './input-text-icon.component';

describe('InputTextIconComponent', () => {
  let component: InputTextIconComponent;
  let fixture: ComponentFixture<InputTextIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputTextIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputTextIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
