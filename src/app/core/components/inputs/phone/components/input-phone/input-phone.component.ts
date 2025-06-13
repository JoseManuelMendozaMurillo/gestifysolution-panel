import { Component, ElementRef, forwardRef, Input, input, InputSignal, OnInit, ViewChild, WritableSignal } from '@angular/core';
import { DefaultControlValueAccessorDirective } from '../../../../../directives/control-value-accessor/default-control-value-accessor.directive';
import { FormControl, FormControlStatus, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from "../../../../icons/spinner/spinner.component";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'input-phone',
  imports: [ReactiveFormsModule, SpinnerComponent, TranslatePipe],
  templateUrl: './input-phone.component.html',
  styleUrl: './input-phone.component.css',
  animations: [
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
      useExisting: forwardRef(() => InputPhoneComponent),
      multi: true
    }
  ],

})
export class InputPhoneComponent extends DefaultControlValueAccessorDirective<number> implements OnInit {

  // Inputs
  @Input({ required: true })
  public focus!: WritableSignal<boolean>;
  public placeholder: InputSignal<string> = input<string>('');
  public parentControl: InputSignal<FormControl> = input.required<FormControl>();
  public identifier: InputSignal<string | undefined> = input<string>();
  public status: InputSignal<FormControlStatus | undefined> = input<FormControlStatus | undefined>(undefined);

  // Properties
  @ViewChild('phoneInput') 
  private phoneInput!: ElementRef<HTMLInputElement>; // 👈 Add this

  // Methods
  public focusInput(): void {
    this.phoneInput.nativeElement.focus();
  }

}
