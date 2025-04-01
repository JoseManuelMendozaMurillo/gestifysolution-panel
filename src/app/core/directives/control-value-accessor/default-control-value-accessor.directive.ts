import { Directive, inject, Injector, OnDestroy, OnInit, signal } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroup, NgControl, NgModel, TouchedChangeEvent } from '@angular/forms';
import { distinctUntilChanged, Subscription } from 'rxjs';

@Directive({
  selector: '[DefaultControlValueAccessor]',
  standalone: true,
})
export class DefaultControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit, OnDestroy {

  // Services
  protected injector: Injector = inject(Injector);

  // Properties
  public value = signal<null | T>(null);
  public disabled = signal<boolean>(false);
  public onChange: (value: T | null) => void = () => {};
  public onTouched: () => void = () => {};

  private _$subsControlChanges?: Subscription;
  private _$subsNgModelChanges?: Subscription;
  private _control?: FormControl;

  // Getters
  public get control(): FormControl {
    if(this._control === undefined) this.initControl();
    return this._control!;
  }

  public ngOnInit(): void {
    this.initControl();
  }

  public ngOnDestroy(): void {
    this._$subsNgModelChanges?.unsubscribe();
    this._$subsControlChanges?.unsubscribe();
  }

  public writeValue(value: T | null): void {
    this.value.set(value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
    this._$subsControlChanges = this.control.valueChanges.pipe(
      distinctUntilChanged(),
    ).subscribe((input) => {
      this.onTouched();
    });
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /* HELPERS */
  protected initControl(): void {
    try{
      const ngControl: NgControl | null = this.injector.get(NgControl, null);

      if(ngControl === null){
        this._control = new FormControl();
        return;
      }
  
      switch (ngControl.constructor) {
        case NgModel:
          const ngModel = ngControl as NgModel;  // Cast to NgModel
          this._control = ngModel.control as FormControl;
          this._$subsNgModelChanges = ngModel.control.valueChanges.subscribe((value) => {
            if (ngModel.model !== value || ngModel.viewModel !== value) {
              ngModel.viewToModelUpdate(value);
            }
          });
          break;
        case FormControlDirective:
          this._control = ngControl.control as FormControl;
          break;
        case FormControlName:
          const container = this.injector.get(ControlContainer).control as FormGroup;
          this._control = container.controls[ngControl?.name!] as FormControl;
          break;
        default:
          this._control = new FormControl();
          break;
      }
    }catch(error){
      console.log(error);
    }
  }

}
