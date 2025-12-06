import { Component, computed, input, output } from '@angular/core';
import { Page } from '../../interfaces/pagination.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { UiSelectComponent } from "../../../core/components/selectors/ui-select/ui-select.component";
import { UiOptionComponent } from "../../../core/components/selectors/ui-select/components/ui-option/ui-option.component";

@Component({
  selector: 'app-pagination',
  imports: [TranslatePipe, UiSelectComponent, UiOptionComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  // Input: The Page object exactly as your API returns it
  public page = input.required<Page>();
  public pageSizeIncrement = input<number>(5);
  public pageSizeSteps = input<number>(4);

  // Output: Emits the 0-indexed page number to send back to the API
  public pageChange = output<number>();
  public pageSizeChange = output<number>();

  // Computed: Convert 0-indexed backend page to 1-indexed UI page
  public uiCurrentPage = computed(() => this.page().number + 1);
  public availablePageSizes = computed(() => {
    const increment = this.pageSizeIncrement();
    const steps = this.pageSizeSteps();

    // Create an array of length 'steps', mapping indices to values
    return Array.from({ length: steps }, (_, i) => (i + 1) * increment);
  });

  // Logic to calculate the "1 ... 4 5 6 ... 99" structure
  public visiblePages = computed(() => {
    const total = this.page().totalPages;
    const current = this.uiCurrentPage(); // Use the 1-based index for calculation
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: number[] = [];
    let l: number | undefined;

    range.push(1);

    for (let i = current - delta; i <= current + delta; i++) {
      if (i < total && i > 1) {
        range.push(i);
      }
    }
    // Only push total if it's greater than 1
    if (total > 1) {
      range.push(total);
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1);
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  });

  public onPageChange(uiPageNumber: number) {
    const total = this.page().totalPages;

    // Validate
    if (uiPageNumber >= 1 && uiPageNumber <= total) {
      // Emit 0-based index (subtract 1)
      this.pageChange.emit(uiPageNumber - 1);
    }
  }

  public onPageSizeChange(newSize: number | null) {
    if (newSize === null) {
      return;
    }
    this.pageSizeChange.emit(newSize);
  }
}
