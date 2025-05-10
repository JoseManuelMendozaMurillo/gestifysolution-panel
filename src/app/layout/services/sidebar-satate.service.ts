import { computed, effect, Injectable, QueryList, signal, WritableSignal } from '@angular/core';
import { MenuListComponent } from '../components/sidebar/components/menu-list/menu-list.component';

interface CancellableSleep {
  promise: Promise<void>;
  cancel: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarSatateService {

  public isSidebarActive: WritableSignal<boolean> = signal(false);
  public isSidebarActiveDelayed = signal(false);
  public isAnyMenuListOpen = signal(false);
  public isMenuItemShown = signal(false);
  public isCenterIcon = signal(false);

  private sidebarReference?: CancellableSleep;
  private menuItemReference?: CancellableSleep;
  private centerIconReference?: CancellableSleep;

  constructor() {
    effect((onCleanup) => {
      const isActive = this.isSidebarActive();
      const isAnyMenuListOpen = this.isAnyMenuListOpen();

      // Cancel previous timer
      this.sidebarReference?.cancel();
      this.menuItemReference?.cancel();
      this.centerIconReference?.cancel();

      // Create new timer
      if(isActive && isAnyMenuListOpen){
        this.sidebarReference = this.sleep(1);
        this.menuItemReference = this.sleep(15);
      }else if(isActive && !isAnyMenuListOpen){
        this.sidebarReference = this.sleep(1);
        this.menuItemReference = this.sleep(15);
      }else if(!isActive && !isAnyMenuListOpen){
        this.sidebarReference = this.sleep(15);
        this.menuItemReference = this.sleep(1);
        this.centerIconReference = this.sleep(200);
      }else{
        this.sidebarReference = this.sleep(216);
        this.menuItemReference = this.sleep(201);
        this.centerIconReference = this.sleep(417);
      }
      
      // Handle cleanup
      onCleanup(() => {
        this.sidebarReference?.cancel();
        this.menuItemReference?.cancel();
        this.centerIconReference?.cancel();
      });

      this.sidebarReference?.promise
        .then(() => this.isSidebarActiveDelayed.set(isActive))
        .catch(() => {/* Handle cancellation if needed */});

      this.menuItemReference?.promise
        .then(() => this.isMenuItemShown.set(isActive))
        .catch(() => {/* Handle cancellation if needed */});
      
      this.centerIconReference?.promise
        .then(() => this.isCenterIcon.set(isActive))
        .catch(() => {/* Handle cancellation if needed */});
    });
  }

  private sleep(ms: number): CancellableSleep {
    let timeoutId: ReturnType<typeof setTimeout>;
    let rejectFn: (reason?: Error) => void;

    const promise = new Promise<void>((resolve, reject) => {
      rejectFn = reject;
      timeoutId = setTimeout(() => {
        resolve();
      }, ms);
    });

    return {
      promise,
      cancel: () => {
        clearTimeout(timeoutId);
        rejectFn();
      }
    };
  }
}


