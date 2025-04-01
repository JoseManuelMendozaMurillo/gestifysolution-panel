import { Directive, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { DefaultControlValueAccessorDirective } from './default-control-value-accessor.directive';
import { Subscription } from 'rxjs';
import { ControlEvent, FormControlStatus, TouchedChangeEvent } from '@angular/forms';
import { ValidatorService } from '../../validations/validator.service';

@Directive({
  selector: '[appInputControlValueAccessor]'
})
export class InputControlValueAccessorDirective<T> extends DefaultControlValueAccessorDirective<T> implements OnInit, OnDestroy {

  constructor() {
    super()
  }

  public status: WritableSignal<FormControlStatus | undefined> = signal(undefined);
  public controlError: WritableSignal<string | null> = signal(null);

  private _$subsEventChanges?: Subscription;
  private _$subsStatusChanges?: Subscription;

  public override ngOnInit(): void {
    super.ngOnInit();
    this.initEventChanges();
    this.initStatusChanges();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._$subsEventChanges?.unsubscribe();
    this._$subsStatusChanges?.unsubscribe();
  }

  private initEventChanges(): void {
    this._$subsEventChanges = this.control.events.subscribe((event: ControlEvent<any>) => {
      if (event instanceof TouchedChangeEvent) {
        this.status.set(this.control.status);
        const constrolError: string | null = ValidatorService.getFirstFieldError(this.control);
        this.controlError.set(constrolError);
      }
    })
  }

  private initStatusChanges(): void {
    this._$subsStatusChanges = this.control.statusChanges.subscribe((status: FormControlStatus) => {
      this.control.markAsTouched();
      this.status.set(status);
      const constrolError: string | null = ValidatorService.getFirstFieldError(this.control);
      this.controlError.set(constrolError);
      console.log(status);
    });
  }

}
