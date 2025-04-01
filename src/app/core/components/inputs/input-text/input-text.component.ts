import { Component, computed, effect, EffectRef, forwardRef, input, InputSignal, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { ValidatorService } from '../../../validations/validator.service';
import { FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InputControlValueAccessorDirective } from '../../../directives/control-value-accessor/input-control-value-accessor.directive';
import { InputValidTypes } from '../../../types/input-types.type';

@Component({
  selector: 'app-input-text',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.css',
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
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent extends InputControlValueAccessorDirective<string> implements OnInit {

  // Inputs
  public inputType: InputSignal<InputValidTypes> = input.required<InputValidTypes>();
  public identifier: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input.required<string>();
  public placeholder: InputSignal<string> = input<string>('');
  public successMessage: InputSignal<string> = input<string>('');
  public helpMessage: InputSignal<string> = input<string>('');

  public delayedMessage: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  public showMessage: WritableSignal<boolean> = signal(true);
  public statePassword: WritableSignal<boolean> = signal(false);
  public type: WritableSignal<InputValidTypes> = signal('password');

  public override ngOnInit(): void {
    super.ngOnInit();
    this.type.set(this.inputType());
  }

  public message: Signal<string | undefined> = computed(() => {
    const status: FormControlStatus | undefined = this.status();
    if (!this.control.touched) return this.helpMessage();
    if (status === 'VALID') return this.successMessage() ? this.successMessage() : this.helpMessage();
    if (status === 'PENDING') return;
    const controlError: string = this.controlError()!;
    const error: string = ValidatorService.getErrorMessage(this.control, controlError);
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
