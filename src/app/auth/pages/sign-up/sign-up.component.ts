import { Component, inject, signal, WritableSignal } from '@angular/core';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";
import { LoadingButtonComponent } from '../../../core/components/buttons/loading-button/loading-button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Boss, CreateBoss } from '../../../bosses/interfaces/bosses.interface';
import { BossesService } from '../../../bosses/services/bosses.service';
import { SharedValidationsService } from '../../../shared/validations/shared-validations.service';
import { SharedAsyncValidationsService } from '../../../shared/validations/shared-async-validations.service';
import { PhoneComponent } from "../../../core/components/inputs/phone/phone.component";
import { CoreValidationsService } from '../../../core/validations/core-validations.service';
import { CountryService } from '../../../core/services/country.service';
import { BossesAsyncValidationsService } from '../../../bosses/validations/bosses-async-validations.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-sing-up',
  imports: [
    InputTextIconComponent,
    LoadingButtonComponent,
    ReactiveFormsModule,
    RouterModule,
    PhoneComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  // Services
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  private bossesService: BossesService = inject(BossesService);
  private countryService: CountryService = inject(CountryService);
  private authService: AuthService = inject(AuthService);

  // Validations
  private sharedValidations: SharedValidationsService = inject(SharedValidationsService);
  private sharedAsyncValidations: SharedAsyncValidationsService = inject(SharedAsyncValidationsService);
  private coreValidations: CoreValidationsService = inject(CoreValidationsService);
  private bossesAsyncValidations: BossesAsyncValidationsService = inject(BossesAsyncValidationsService);

  // Properties
  public isLoading: WritableSignal<boolean> = signal<boolean>(false);
  public form: FormGroup = this.fb.group({
    username: [
      null,
      [
        Validators.required,
        this.sharedValidations.usernamePattern(),
        Validators.minLength(3),
        Validators.maxLength(255),
      ],
      [this.sharedAsyncValidations.isUsernameExist()]
    ],
    email: [
      null,
      [
        Validators.required,
        this.sharedValidations.emailPattern()
      ],
      [this.sharedAsyncValidations.isEmailExist()]
    ],
    firstName: [
      null,
      [
        Validators.required,
        Validators.maxLength(255),
        this.sharedValidations.namePattern(),
      ]
    ],
    lastName: [
      null,
      [
        Validators.required,
        Validators.maxLength(255),
        this.sharedValidations.namePattern(),
      ]
    ],
    password: [
      null,
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],
    phone: [
      {
        country: this.countryService.getCountryByCode('MX'),
        phone: null
      },
      [this.coreValidations.internationalPhoneValidation()],
      [this.bossesAsyncValidations.isPhoneExist()]
    ],
    birthdate: [
      null,
      [
        this.sharedValidations.pastOrPresentDate()
      ]
    ],
  });

  // Methods
  public async submit(): Promise<void> {
    this.isLoading.set(true);

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.isLoading.set(false);
      return;
    }

    // Get data
    const bossData: any = this.form.value;

    // Create account
    const newBoss: Boss|null = await this.createBoss(bossData);

    if(newBoss === null) {
      console.error('Error al crear el registro');
      return;
    }

    // Login
    const isAuthenticated: boolean = await this.login(bossData);
    
    if(!isAuthenticated){
      console.error('Error al iniciar sesión');
      return;
    }

    this.isLoading.set(false);

    // Redirect to home page
    this.router.navigateByUrl('/');
  }

  private async createBoss(data: any): Promise<Boss | null> {
    try {
      let phone: string | null = null;
      if (data.phone != null && data.phone.country !== null && data.phone.phone != null) {
        phone = `+${data.phone.country.phoneExtension} ${data.phone.phone}`;
      }

      const createBoss: CreateBoss = {
        user: {
          username: data.username ?? null,
          email: data.email ?? null,
          firstName: data.firstName ?? null,
          lastName: data.lastName ?? null,
          password: data.password ?? null,
        },
        phone: phone,
        birthdate: data.birthdate ?? null
      }

      const newBoss: Boss = await firstValueFrom(this.bossesService.create(createBoss, this.form));
      return newBoss;
    } catch (error) {
      return null;
    }
  }

  private async login(data: any): Promise<boolean> {
    const isAuthenticated: boolean = await this.authService.login({
      username: data.username,
      password: data.password
    })
    
    return isAuthenticated;
  } 

}
