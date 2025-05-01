import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, computed, forwardRef, inject, Input, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormBuilder, FormControl, FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Dropdown, DropdownInterface } from 'flowbite';
import { startWith, debounceTime } from 'rxjs';
import { Country } from '../../../../../types/country.type';
import { CountryService } from '../../../../../services/country.service';

@Component({
  selector: 'select-country-phone-code',
  imports: [ReactiveFormsModule],
  templateUrl: './select-country-phone-code.component.html',
  styleUrl: '././select-country-phone-code.component.css',
  animations: [
    trigger('dropdownAnimation', [
      state('open', style({
        opacity: 1,
      })),
      state('closed', style({
        opacity: 0,
      })),
      transition('open <=> closed', [
        animate('200ms ease-out')
      ])
    ]),
    trigger('caretRotate', [
      state('open', style({
        transform: 'rotate(180deg)'
      })),
      state('closed', style({
        transform: 'rotate(0deg)'
      })),
      transition('open <=> closed', [
        animate('200ms ease-out')
      ])
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectCountryPhoneCodeComponent),
      multi: true
    }
  ],
})
export class SelectCountryPhoneCodeComponent implements ControlValueAccessor, OnInit {

  // Inputs
  @Input({ required: true }) 
  public focus!: WritableSignal<boolean>;
  public control: InputSignal<FormControl> = input.required<FormControl>();
  public status: InputSignal<FormControlStatus | undefined> = input<FormControlStatus | undefined>(undefined);

  // ControlValueAccessor implementation
  public onChange: (value: Country) => void = () => {};
  public onTouched: () => void = () => {};

  writeValue(value: Country): void {
    this.selectedCountry.set(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Lifecycle methods
  public ngOnInit(): void {
    this.countries.set(this.countryService.getCountries())
    this.initDropdownPhonesExtension();
  }

  // Services
  private fb: FormBuilder = inject(FormBuilder);

  private countryService: CountryService = inject(CountryService);

  // Properties
  public search: FormControl = this.fb.control('');
  public countries: WritableSignal<Country[]> = signal([]);
  public selectedCountry: WritableSignal<Country|null> = signal(null);

  private _dropdown?: DropdownInterface = undefined;
  private searchTerm = toSignal(
    this.search.valueChanges.pipe(
      startWith(''),
      debounceTime(200)
    )
  );
  
  // Getters
  get dropdown(): DropdownInterface {
    if (this._dropdown === undefined) {
      this.initDropdownPhonesExtension();
    }
    return this._dropdown!;
  }

  // Computed properties
  public filteredCountries: Signal<Country[]> = computed(() => {
    const term: string = (this.searchTerm() || '').toLowerCase();
    return this.countries().filter(country =>
      country.name.toLowerCase().includes(term)
    );
  });

  // Functions
  public onChangeCountry(newCountry: Country) {
    this.selectedCountry.set(newCountry);
    this.dropdown.hide();
    this.onChange(newCountry);
  }

  private initDropdownPhonesExtension(): void {
    const dropdownContainer: HTMLElement = document.getElementById('dropdown-phone')!;
    const triggerButton: HTMLElement = document.getElementById('dropdown-phone-button')!;
    this._dropdown = new Dropdown(
      dropdownContainer,
      triggerButton,
      {
        placement: 'bottom',
        triggerType: 'click',
        onHide: () => {
          dropdownContainer.classList.remove('hidden');
          setTimeout(() => {
            dropdownContainer.classList.remove('flex', 'flex-col');
            dropdownContainer.classList.add('hidden');
          }, 200)
        },
        onShow: () => {
          dropdownContainer.classList.add('flex', 'flex-col');
        },
      }
    );
  }

}

