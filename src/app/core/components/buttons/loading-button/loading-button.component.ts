import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { Component, effect, EffectRef, input, InputSignal, signal, WritableSignal } from '@angular/core';

@Component({
  selector: '[appLoadingButton]',
  imports: [],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.css',
  animations: [
    trigger('spinnerAnimation', [
      state('void', style({ opacity: 0, transform: 'translateY(-10px)' })),
      state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
      state('hidden', style({ opacity: 0, transform: 'translateY(-10px)' })),
      transition('void => visible', [animate('200ms ease-in-out')]),
      transition('visible => hidden', [animate('200ms ease-in-out')]),
      transition('hidden => visible', [animate('200ms ease-in-out')]),
    ]),
  ]
})
export class LoadingButtonComponent {


  public loading: InputSignal<boolean> = input<boolean>(false);
  public textLoading: InputSignal<string> = input<string>('Cargando...');

  public showSpinner: WritableSignal<boolean> = signal(false);
  public showContent: WritableSignal<boolean> = signal(true);
  public displaySpinnerStyle: WritableSignal<string> = signal('none');
  public displayContentStyle: WritableSignal<string> = signal('block');


  public changeContentEffect: EffectRef = effect(() => {
    if (this.loading()) {
      this.showContent.set(false);
      var timer = setTimeout(() => {
        this.displayContentStyle.set('none')
        this.displaySpinnerStyle.set('block');
        this.showSpinner.set(true);
      }, 200);
    } else {
      this.showSpinner.set(false);
      var timer = setTimeout(() => {
        this.displayContentStyle.set('block')
        this.displaySpinnerStyle.set('none');
        this.showContent.set(true)
      }, 200);
    }

    return () => clearTimeout(timer);
  });

}
