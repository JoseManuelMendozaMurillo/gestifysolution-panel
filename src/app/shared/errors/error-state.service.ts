import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorStateService {
  constructor() {}

  // Properties
  public unexpectedError: WritableSignal<boolean> = signal(false);

  private timeoutId: any = undefined;

  public showError(): void {
    // Clear existing timeout if any
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.unexpectedError.set(true);
    this.timeoutId = setTimeout(() => {
      this.hideError();
    }, 4000);
  }

  public hideError(): void {
    this.unexpectedError.set(false);
  }
}
