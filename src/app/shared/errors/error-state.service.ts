import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorStateService {
  constructor() {}

  // Services
  private translateService: TranslateService = inject(TranslateService);

  // Properties
  public unexpectedError: WritableSignal<boolean> = signal(false);
  public title: Observable<string> = this.translateService.stream('errors.unexpectedError.title');
  public description: Observable<string> = this.translateService.stream('errors.unexpectedError.description');

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
