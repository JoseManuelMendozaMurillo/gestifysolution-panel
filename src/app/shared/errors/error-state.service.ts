import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorStateService {
  constructor() {}

  // Properties
  public unexpectedError: WritableSignal<boolean> = signal(false);
  public title: WritableSignal<string> = signal('Error inesperado');
  public description: WritableSignal<string> = signal('Porfavor intentelo de nuevo mas tarde');

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  public showError(): void {
    // Clear any existing timeout
    this.clearTimeout();
    this.unexpectedError.set(true);
    this.timeoutId = setTimeout(() => {
      this.hideError();
    }, 4000);
  }

  public hideError(): void {
    this.clearTimeout();
    this.unexpectedError.set(false);
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
