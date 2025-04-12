import { Component, computed, effect, EffectRef, forwardRef, inject, input, InputSignal, OnDestroy, OnInit, Signal, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { ControlEvent, FormBuilder, FormControl, FormControlStatus, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, TouchedChangeEvent, ValidationErrors } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ValidatorService } from '../../../validations/validator.service';
import { Phone } from '../../../types/phone.type';
import { SelectCountryPhoneCodeComponent } from "./components/select-country-phone-code/select-country-phone-code.component";
import { InputPhoneComponent } from './components/input-phone/input-phone.component';
import { CoreValidationsService } from '../../../validations/core-validations.service';
import { DefaultControlValueAccessorDirective } from '../../../directives/control-value-accessor/default-control-value-accessor.directive';
import { distinctUntilChanged, Subscription, switchMap } from 'rxjs';


@Component({
  selector: 'app-input-phone',
  imports: [ReactiveFormsModule, SelectCountryPhoneCodeComponent, InputPhoneComponent],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css',
  animations: [
    trigger('validationMessage', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('75ms ease-in-out')]),
      transition('visible => hidden', [animate('75ms ease-in-out')]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneComponent),
      multi: true
    }
  ],
})
export class PhoneComponent extends DefaultControlValueAccessorDirective<Phone> implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  // Inputs
  public identifier: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input.required<string>();
  public placeholder: InputSignal<string> = input<string>('');
  public successMessage: InputSignal<string> = input<string>('');
  public helpMessage: InputSignal<string> = input<string>('');

  // Services
  private fb: FormBuilder = inject(FormBuilder);

  private coreValidations: CoreValidationsService = inject(CoreValidationsService);

  // Properties
  public focus: WritableSignal<boolean> = signal(false);
  public delayedMessage: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  public showMessage: WritableSignal<boolean> = signal(true);
  public phoneForm: FormGroup = this.fb.group({
    country: [null, []],
    phone: [null, []]
  })
  public status: WritableSignal<FormControlStatus | undefined> = signal(undefined);
  public controlError: WritableSignal<string | null> = signal(null);

  @ViewChild(InputPhoneComponent)
  private phoneInputComponent: InputPhoneComponent | null = null;

  private $subsPhoneControlEventChanges?: Subscription;
  private $subsPhoneControlValueChanges?: Subscription;
  private $subsCountryControlValueChanges?: Subscription;
  private $subsStatusChanges?: Subscription;
  private $subsEventChanges?: Subscription;

  // Getters
  get phoneControl(): FormControl {
    return this.phoneForm.get('phone') as FormControl;
  }

  get countryControl(): FormControl {
    return this.phoneForm.get('country') as FormControl;
  }

  // Lifecycle hooks
  public override ngOnInit(): void {
    super.ngOnInit();

    this.$subsEventChanges = this.control.events.subscribe((event: ControlEvent<any>) => {
      if (event instanceof TouchedChangeEvent) {
        if (!event.touched) {
          this.status.set(undefined);
          this.controlError.set(null);
          this.phoneForm.markAsUntouched();
        } else {
          this.phoneForm.markAllAsTouched();
        }
      }
    })

    this.$subsStatusChanges = this.control.statusChanges.subscribe((status: FormControlStatus) => {
      this.status.set(status);
      const controlError: string | null = ValidatorService.getFirstFieldError(this.control);
      this.controlError.set(controlError);
    })

    this.$subsPhoneControlEventChanges = this.phoneControl.events.subscribe((event: ControlEvent<any>) => {
      if (event instanceof TouchedChangeEvent) {
        if(event.touched){
          this.control.markAsTouched();
          const controlError: string | null = ValidatorService.getFirstFieldError(this.control);
          this.controlError.set(controlError);
          this.status.set(this.control.status);
        }
      }
    })

    this.$subsPhoneControlValueChanges = this.phoneControl.valueChanges
      .pipe(
        distinctUntilChanged()
      )
      .subscribe((phone: any) => {
        if (phone === null || phone === undefined || phone === '') phone = null;
        else phone = Number(phone);
        let value: any = this.phoneForm.value;
        value.phone = phone
        this.onChange(value);
        if(phone){
          this.onTouched();
        }
      })

    this.$subsCountryControlValueChanges = this.countryControl.valueChanges
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe((country: any) => {
        let value: any = this.phoneForm.value;
        value.country = country;
        let phone = value.phone;
        if (phone === null || phone === undefined || phone === '') phone = null;
        else phone = Number(phone);
        value.phone = phone;
        this.onChange(value);
        this.onTouched();
        // Set focus to the input phone
        this.phoneInputComponent?.focusInput();
      });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.$subsEventChanges?.unsubscribe();
    this.$subsStatusChanges?.unsubscribe();
    this.$subsPhoneControlEventChanges?.unsubscribe();
    this.$subsPhoneControlValueChanges?.unsubscribe();
    this.$subsCountryControlValueChanges?.unsubscribe();
  }

  // Control value accessor 
  public override writeValue(value: Phone | null): void {
    if (value !== null && value.country !== null) {
      const countryError: ValidationErrors | null = this.coreValidations.validateCountry(value.country);
      if (countryError) {
        const keyError: string = Object.keys(countryError)[0];
        const message: string = ValidatorService.validationMessages[keyError] ?? 'Error en el objeto country'
        throw new Error(message);
      }
    }

    if(!value){
      value = {
        country: this.countryControl.value ?? null,
        phone: null
      }
    }
    super.writeValue(value);
    this.phoneForm.patchValue({ country: value?.country ?? null, phone: value?.phone ?? null });
  }

  // Computed properties
  public message: Signal<string | undefined> = computed(() => {
    const status: FormControlStatus | undefined = this.status();
    const controlError: string | null = this.controlError();
    if (!this.control.touched) return this.helpMessage();
    if (status === 'VALID') return this.successMessage() ? this.successMessage() : this.helpMessage();
    if (status === 'PENDING') return;
    const error: string = ValidatorService.getFieldErrorMessage(this.control, controlError!);
    return error;
  });

  // Effects
  public changeMessageEffect: EffectRef = effect(() => {
    const currentMessage = this.message();
    this.showMessage.set(false);
    const timer = setTimeout(() => {
      this.delayedMessage.set(currentMessage);
      this.showMessage.set(true);
    }, 100);

    // Cleanup function to clear the timeout if the effect re-runs
    return () => clearTimeout(timer);
  });
}
