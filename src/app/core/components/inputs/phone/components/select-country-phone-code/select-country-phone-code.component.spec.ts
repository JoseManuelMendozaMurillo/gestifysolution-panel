import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCountryPhoneCodeComponent } from './select-country-phone-code.component';

describe('SelectCountryPhoneCodeComponent', () => {
  let component: SelectCountryPhoneCodeComponent;
  let fixture: ComponentFixture<SelectCountryPhoneCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCountryPhoneCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectCountryPhoneCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
