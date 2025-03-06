import { Component, computed, effect, EffectRef, forwardRef, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DefaultControlValueAccessorDirective } from '../../../directives/control-value-accessor/default-control-value-accessor.directive';
import { ValidatorService } from '../../../validations/validator.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  animations: [
    trigger('validationMessage', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('100ms ease-in-out')]),
      transition('visible => hidden', [animate('100ms ease-in-out')]),
      transition('hidden => visible', [animate('100ms ease-in-out')]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent extends DefaultControlValueAccessorDirective<boolean> {

  public identifier: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input.required<string>();
  public successMessage: InputSignal<string> = input<string>('');
  public helpMessage: InputSignal<string> = input<string>('');

  public delayedMessage: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  public showMessage: WritableSignal<boolean> = signal(true);

  public message: Signal<string> = computed(() => {
    const isValid = this.isValidField();
    if (!this.control.touched) {
      return `<span>${this.helpMessage()}</span>`;
    }
    if (isValid) {
      const successIcon = '<i class="fa-solid fa-circle-check"></i>';
      return this.successMessage()
        ? `${successIcon} <span>${this.successMessage()}</span>`
        : `<span>${this.helpMessage()}</span>`;
    }
    const firstKeyError: string = ValidatorService.getFirstFieldError(this.control)!;
    const error = this.control.getError(firstKeyError);
    const errorIcon = '<i class="fa-solid fa-circle-exclamation"></i>';
    let errorMessage = 'Hay un error en este campo';
    if (typeof error === 'boolean') {
      errorMessage = ValidatorService.validationMessages[firstKeyError] ?? errorMessage;
    } else if (typeof error === 'string') {
      errorMessage = error.toString();
    }
    return `${errorIcon} <span>${errorMessage}</span>`;
  });

  public changeMessageEffect: EffectRef = effect(() => {
    const currentMessage = this.message();
    this.showMessage.set(false);
    const timer = setTimeout(() => {
      this.delayedMessage.set(currentMessage);
      this.showMessage.set(true);
    }, 125);

    // Cleanup function to clear the timeout if the effect re-runs
    return () => clearTimeout(timer);
  });

}
