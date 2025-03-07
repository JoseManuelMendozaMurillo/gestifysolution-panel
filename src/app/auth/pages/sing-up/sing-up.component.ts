import { Component, inject, signal, WritableSignal } from '@angular/core';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";
import { LoadingButtonComponent } from '../../../core/components/buttons/loading-button/loading-button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'auth-sing-up',
  imports: [InputTextIconComponent, LoadingButtonComponent, ReactiveFormsModule],
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.css'
})
export class SingUpComponent {

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  
  private fb: FormBuilder = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    conditions: [false, []]
  });

  public submit(): void {
    this.form.markAllAsTouched();
    this.isLoading.set(true);

    setTimeout(() => this.isLoading.set(false), 5000)

    console.log(this.form.valid);

  }


}
