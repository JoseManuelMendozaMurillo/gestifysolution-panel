import { Component, inject, OnInit } from '@angular/core';
import { InputTextComponent } from '../../../core/components/inputs/input-text/input-text.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";

@Component({
  selector: 'auth-login',
  imports: [InputTextComponent, ReactiveFormsModule, InputTextIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  
  
  ngOnInit(): void {
  }

  private fb: FormBuilder = inject(FormBuilder);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    emailIcon: ['', [Validators.email, Validators.required]],
    password: []
  });

}
