import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";
import { CheckboxComponent } from "../../../core/components/inputs/checkbox/checkbox.component";
import { LoadingButtonComponent } from "../../../core/components/buttons/loading-button/loading-button.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'auth-sign-in',
  imports: [
    ReactiveFormsModule, 
    InputTextIconComponent, 
    CheckboxComponent, 
    LoadingButtonComponent,
    RouterModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent implements OnInit {
  
  ngOnInit(): void {
  }

  private fb: FormBuilder = inject(FormBuilder);

  public isLoading: WritableSignal<boolean> = signal<boolean>(false);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    conditions: [false, []]
  });

  submit() {
    this.form.markAllAsTouched();
    this.isLoading.set(true);

    setTimeout(() => this.isLoading.set(false), 5000)

    console.log(this.form.valid);

  }


}
