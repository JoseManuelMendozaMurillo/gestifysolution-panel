import { Component, computed, effect, EffectRef, forwardRef, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { DefaultControlValueAccessorDirective } from '../../../directives/control-value-accessor/default-control-value-accessor.directive';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ValidatorService } from '../../../validations/validator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-text-icon',
  imports: [CommonModule, ReactiveFormsModule],
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
export class InputTextIconComponent extends DefaultControlValueAccessorDirective<string> {
    // Inputs
    public identifier: InputSignal<string|undefined> = input<string>();
    public label: InputSignal<string> = input.required<string>();
    public placeholder: InputSignal<string> = input<string>('');
    public successMessage: InputSignal<string> = input<string>('');
    public helpMessage: InputSignal<string> = input<string>('');
    public fontAwesomeIcon: InputSignal<string> = input.required<string>();
  
    public delayedMessage: WritableSignal<string|undefined> = signal<string | undefined>(undefined);
    public showMessage: WritableSignal<boolean> = signal(true);

    public message: Signal<string | undefined> = computed(() => {
      this.isEmpty();
      if (this.control.pristine) return this.helpMessage();
      if (this.isValidField()) return this.successMessage();
      const firstKeyError: string = ValidatorService.getFirstFieldError(this.control)!;
      const error = this.control!.getError(firstKeyError);
      let errorMessage: string = "Hay un error en este campo";
      if(typeof error === 'boolean'){
        errorMessage = ValidatorService.validationMessages[firstKeyError] ?? errorMessage;
      }else if(typeof error === 'string'){
        errorMessage = error.toString();
      }
      return errorMessage;
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
}
