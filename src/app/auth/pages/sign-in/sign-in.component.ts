import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";
import { CheckboxComponent } from "../../../core/components/inputs/checkbox/checkbox.component";
import { LoadingButtonComponent } from "../../../core/components/buttons/loading-button/loading-button.component";
import { Router, RouterModule } from '@angular/router';
import { SharedAsyncValidationsService } from '../../../shared/validations/shared-async-validations.service';
import { SharedValidationsService } from '../../../shared/validations/shared-validations.service';
import { AuthService } from '../../services/auth.service';
import { HttpStatusCode } from '@angular/common/http';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  styleUrl: './sign-in.component.css',
  animations: [
    trigger('unexpectedError', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('100ms ease-in-out')]),
      transition('visible <=> hidden', [animate('100ms ease-in-out')]),
    ]),
  ],
})
export class SignInComponent implements OnInit {

  ngOnInit(): void {
  }

  // Services
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  private authService: AuthService = inject(AuthService);

  // Validators
  private sharedValidations: SharedValidationsService = inject(SharedValidationsService);
  private sharedAsyncValidations: SharedAsyncValidationsService = inject(SharedAsyncValidationsService);

  // Properties
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public unexpectedError: WritableSignal<boolean> = signal<boolean>(false);

  // Getters
  get username(): FormControl {
    return this.form.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public form: FormGroup = this.fb.group({
    username: [
      null,
      [
        Validators.required,
        this.sharedValidations.usernamePattern(),
        Validators.minLength(3),
        Validators.maxLength(255),
      ],
      //[this.sharedAsyncValidations.isUsernameExist()]
    ],
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    rememberMe: [false, []]
  });

  public async submit(): Promise<void> {
    this.isLoading.set(true);

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.isLoading.set(false);
      return;
    }

    const isLogged: boolean = await this.authService.login({
      username: this.username.value,
      password: this.password.value
    });

    if (!isLogged) {
      this.handleLoginError();
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(false);

    this.router.navigateByUrl('/');
  }

  private handleLoginError(): void {
    if (this.authService.lastHttpError()?.status === HttpStatusCode.Unauthorized) {
      this.password.setErrors({ invalidPassword: true })
      return;
    }

    this.unexpectedError.set(true);
  }


}
