import { trigger, transition, style, animate, state } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, input, model, signal, TemplateRef, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'app-ui-select',
  imports: [CommonModule],
  templateUrl: './ui-select.component.html',
  styleUrl: './ui-select.component.css',
  animations: [
    trigger('dropdown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px) scale(0.95)' }),
        animate('100ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('75ms ease-in', style({ opacity: 0, transform: 'translateY(-5px) scale(0.95)' }))
      ])
    ]),
    trigger('rotate', [
      state('open', style({ transform: 'rotate(180deg)' })),
      state('closed', style({ transform: 'rotate(0deg)' })),
      transition('open <=> closed', animate('150ms ease'))
    ])
  ]
})
export class UiSelectComponent<T> {
  // Inputs
  public placeholder = input<string>('Select...');
  public triggerTemplate = input<TemplateRef<{ $implicit: T }>>();

  // Services
  private elementRef: ElementRef = inject(ElementRef);

  // Properties
  public value = model<T | null>(null);
  public isOpen = signal(false);
  public dropdownPosition = signal<'top' | 'bottom'>('bottom');

  public toggle() {
    if (!this.isOpen()) {
      this.calculatePosition();
    }
    this.isOpen.update(v => !v);
  }

  private calculatePosition() {
    const element = this.elementRef.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - rect.bottom;
    const dropdownHeight = 250; // Estimated max height (max-h-60 is 15rem = 240px + padding)

    if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
      this.dropdownPosition.set('top');
    } else {
      this.dropdownPosition.set('bottom');
    }
  }

  public close() {
    this.isOpen.set(false);
  }

  // Called by child OptionComponent
  public selectOption(val: T) {
    this.value.set(val);
    this.close();
  }
}
