import { Component, inject, signal, WritableSignal } from '@angular/core';
import { InputTextIconComponent } from "../../../core/components/inputs/input-text-icon/input-text-icon.component";
import { LoadingButtonComponent } from '../../../core/components/buttons/loading-button/loading-button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Boss, CreateBoss } from '../../../bosses/interfaces/bosses.interface';
import { BossesService } from '../../../bosses/services/bosses.service';
import { SharedValidationsService } from '../../../shared/validations/shared-validations.service';
import { SharedAsyncValidationsService } from '../../../shared/validations/shared-async-validations.service';
import { PhoneComponent } from "../../../core/components/inputs/phone/phone.component";
import { CoreValidationsService } from '../../../core/validations/core-validations.service';
import { CountryService } from '../../../core/services/country.service';

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

  private sharedValidations: SharedValidationsService = inject(SharedValidationsService);
  private sharedAsyncValidations: SharedAsyncValidationsService = inject(SharedAsyncValidationsService);
  private coreValidations: CoreValidationsService = inject(CoreValidationsService);
  private bossesService: BossesService = inject(BossesService);
  private countryService: CountryService = inject(CountryService);

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
      [
        this.sharedAsyncValidations.isUsernameExist()
      ]
    ],
    email: [null, []],
    firstName: [null, []],
    lastName: [null, []],
    password: [null, [Validators.required, Validators.minLength(8)]],
    phone: [
      {
        country: this.countryService.getCountryByCode('MX'),
        phone: null
      }, 
      [this.coreValidations.internationalPhoneValidation()]
    ],
    birthdate: [null, []],
  });

  // Methods
  public submit(): void {
    this.form.markAllAsTouched();
    this.isLoading.set(true);

    this.createBoss(this.form.value);

    this.isLoading.set(false);
  }

  public createBoss(data: any): void {
    const createBoss: CreateBoss = {
      user: {
        username: data.username ?? null,
        email: data.email ?? null,
        firstName: data.firstName ?? null,
        lastName: data.lastName ?? null,
        password: data.password ?? null,
      },
      phone: data.phone ?? null,
      birthdate: data.birthdate ?? null
    }

    this.bossesService.create(createBoss, this.form).subscribe((boss: Boss) => {
      console.log(boss);
    })

  }

}
