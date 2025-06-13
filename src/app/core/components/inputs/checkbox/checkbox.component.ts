import { Component, computed, effect, EffectRef, forwardRef, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ValidatorService } from '../../../validations/validator.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InputControlValueAccessorDirective } from '../../../directives/control-value-accessor/input-control-value-accessor.directive';
import { TranslatePipe } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  imports: [ReactiveFormsModule, TranslatePipe],
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
export class CheckboxComponent extends InputControlValueAccessorDirective<boolean> {

  // Inputs
  public identifier: InputSignal<string | undefined> = input<string>();
  public label: InputSignal<string> = input.required<string>();
  public successMessage: InputSignal<string> = input<string>('');
  public helpMessage: InputSignal<string> = input<string>('');

  // Services
  private validatorService: ValidatorService = inject(ValidatorService);

  // Properties
  public delayedMessage: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
  public showMessage: WritableSignal<boolean> = signal(true);

  public message: Signal<string | undefined> = computed(() => {
    const status: FormControlStatus | undefined = this.status();
    if (!this.control.touched) {
      return `<span>${this.helpMessage()}</span>`;
    }
    if (status === 'VALID') {
      const successIcon = '<i class="fa-solid fa-circle-check"></i>';
      return this.successMessage()
        ? `${successIcon} <span>${this.successMessage()}</span>`
        : `<span>${this.helpMessage()}</span>`;
    }
    if (status === 'PENDING') return;
    const controlError: string = this.controlError()!;
    const errorMessage: Observable<string> = this.validatorService.getFieldErrorMessage(this.control, controlError);
    const errorIcon = '<i class="fa-solid fa-circle-exclamation"></i>';
    return `${errorIcon} <span>${errorMessage.pipe(map(message => message))}</span>`;
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
