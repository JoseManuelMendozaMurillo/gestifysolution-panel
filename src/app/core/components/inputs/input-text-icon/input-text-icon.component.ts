import { Component, computed, effect, EffectRef, forwardRef, inject, input, InputSignal, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ValidatorService } from '../../../validations/validator.service';
import { CommonModule } from '@angular/common';
import { InputValidTypes } from '../../../types/input-types.type';
import { InputControlValueAccessorDirective } from '../../../directives/control-value-accessor/input-control-value-accessor.directive';
import { SpinnerComponent } from '../../icons/spinner/spinner.component';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-input-text-icon',
  imports: [CommonModule, ReactiveFormsModule, SpinnerComponent, TranslatePipe],
  templateUrl: './input-text-icon.component.html',
  styleUrl: './input-text-icon.component.css',
  animations: [
    trigger('validationMessage', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('75ms ease-in-out')]),
      transition('visible => hidden', [animate('75ms ease-in-out')]),
    ]),
    trigger('validationIcon', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('400ms ease-in-out')]),
      transition('visible => hidden', [animate('400ms ease-in-out')]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextIconComponent),
      multi: true,
    },
  ],
})
export class InputTextIconComponent extends InputControlValueAccessorDirective<string> implements OnInit {
  // Inputs
  public inputType: InputSignal<InputValidTypes> = input.required<InputValidTypes>();
  public identifier: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input.required<string>();
  public placeholder: InputSignal<string> = input<string>('');
  public successMessage: InputSignal<string> = input<string>('');
  public helpMessage: InputSignal<string> = input<string>('');
  public fontAwesomeIcon: InputSignal<string> = input.required<string>();

  // Services
  private validatorService: ValidatorService = inject(ValidatorService);

  // Properties
  public delayedMessage: WritableSignal<Observable<string> | undefined> = signal(undefined);
  public showMessage: WritableSignal<boolean> = signal(true);
  public statePassword: WritableSignal<boolean> = signal(false);
  public type: WritableSignal<InputValidTypes> = signal('password');


  public override ngOnInit(): void {
    super.ngOnInit();
    this.type.set(this.inputType());
  }

  public message: Signal<Observable<string> | undefined> = computed(() => {
    const status: FormControlStatus | undefined = this.status();
    if (!this.control.touched) return of(this.helpMessage());
    if (status === 'VALID') return this.successMessage() ? of(this.successMessage()) : of(this.helpMessage());
    if (status === 'PENDING') return;
    const controlError: string = this.controlError()!;
    const error: Observable<string> = this.validatorService.getFieldErrorMessage(this.control, controlError);
    return error;
  });

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

  public showPassword(): void {
    this.statePassword.set(true);
    this.type.set('text');
  }

  public hiddenPassword(): void {
    this.statePassword.set(false);
    this.type.set('password');
  }
}
