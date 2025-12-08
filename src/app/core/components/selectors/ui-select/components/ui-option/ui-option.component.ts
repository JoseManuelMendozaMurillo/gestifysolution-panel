import { Component, computed, ElementRef, HostListener, inject, input } from '@angular/core';
import { UiSelectComponent } from '../../ui-select.component';

@Component({
  selector: 'app-ui-option',
  imports: [],
  templateUrl: './ui-option.component.html',
  styleUrl: './ui-option.component.css'
})
export class UiOptionComponent<T> {
  // Dependencies
  private parent = inject(UiSelectComponent);

  // Input: The value associated with this option
  public value = input.required<T>();

  // Computed: Is this option currently selected?
  public isSelected = computed(() => this.parent.value() === this.value());

  @HostListener('click')
  public onClick() {
    // Send both the value and the inner HTML (for display) to the parent
    this.parent.selectOption(this.value());
  }
}
