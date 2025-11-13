import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-business',
  imports: [],
  templateUrl: './create-business.component.html',
  styleUrl: './create-business.component.css'
})
export class CreateBusinessComponent implements OnInit {
  // Services
  private translateService: TranslateService = inject(TranslateService);

  // Properties
  public title: WritableSignal<string> = signal('');

  // Lifecycle methods
  public ngOnInit(): void {
    this.translateService.stream('app.layout.sidebar.listBusinesses.linkListBusinesses').subscribe((title: string) => {
      this.title.set(title);
    });
  }
}
