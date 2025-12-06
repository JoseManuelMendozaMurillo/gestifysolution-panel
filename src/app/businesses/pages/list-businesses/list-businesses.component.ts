import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CardBusinessComponent } from "./components/card-business/card-business.component";
import { BossesService } from '../../../bosses/services/bosses.service';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { Business } from '../../interfaces/businesses.interfaces';
import { AuthService } from '../../../auth/services/auth.service';
import { LoadingSpinnerComponent } from "../../../shared/components/loading-spinner/loading-spinner.component";
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-list-businesses',
  imports: [CardBusinessComponent, LoadingSpinnerComponent, PaginationComponent, TranslatePipe],
  templateUrl: './list-businesses.component.html',
  styleUrls: ['./list-businesses.component.css']
})
export class ListBusinessesComponent implements OnInit {
  // Services
  private translateService: TranslateService = inject(TranslateService);
  private bossesService = inject(BossesService);
  private authService = inject(AuthService);

  // Properties
  public title: WritableSignal<string> = signal('');
  public businesses: WritableSignal<Pagination<Business> | null> = signal(null);
  public sizePage: WritableSignal<number> = signal(10);
  public currentPage: WritableSignal<number> = signal(0);
  public username: Signal<string> = computed(() => this.authService.tokenPayload()!.preferredUsername);

  // Lifecycle methods
  public async ngOnInit(): Promise<void> {
    this.translateService.stream('app.layout.sidebar.listBusinesses.linkListBusinesses').subscribe((title: string) => {
      this.title.set(title);
    });

    // Getting businesses for the logged-in boss
    await this.fetchBusinessesByPage();
  }

  // Methods
  public async handlePageChange(newPageIndex: number) {
    this.currentPage.set(newPageIndex);
    await this.fetchBusinessesByPage();
  }

  public async handlePageSizeChange(newPageSize: number) {
    this.sizePage.set(newPageSize);
    this.currentPage.set(0);
    await this.fetchBusinessesByPage();
  }

  private async fetchBusinessesByPage(): Promise<void> {
    const params: { size: number, page: number } = { size: this.sizePage(), page: this.currentPage() };
    const username: string = this.username();
    const businesses: Pagination<Business> | null = await this.bossesService.getBusinessesByBossUsername(username, params);
    this.businesses.set(businesses);
  }
}
