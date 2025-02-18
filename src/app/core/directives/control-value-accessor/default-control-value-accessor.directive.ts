import { Directive, inject, Injector, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, FormControlName, FormGroup, NgControl, NgModel } from '@angular/forms';
import { distinctUntilChanged, startWith, Subscription, tap } from 'rxjs';

@Directive({
  selector: '[DefaultControlValueAccessor]',
  standalone: true,
})
export class DefaultControlValueAccessorDirective<T> implements ControlValueAccessor, OnInit, OnDestroy {

  // Services
  private injector: Injector = inject(Injector);

  // Properties
  public isValidField: WritableSignal<boolean|undefined> = signal(undefined);
  public isEmpty: WritableSignal<boolean|undefined> = signal(undefined);
  public value = signal<null | T>(null);
  public disabled = signal<boolean>(false);

  private _onTouched!: () => T;
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

  public registerOnChange(fn: (val: T | null) => T): void {
    this._$subsControlChanges = this.control.valueChanges.pipe(
      distinctUntilChanged(),
      //tap((val: T | null) => fn(val))
    ).subscribe((input: string) => {
      //this.control.markAsUntouched();
      this.isValidField.set(this.control.valid);
      if(input === '') this.isEmpty.set(true);
      else this.isEmpty.set(false);
    });
  }

  public registerOnTouched(fn: () => T): void {
    this._onTouched = fn;
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
