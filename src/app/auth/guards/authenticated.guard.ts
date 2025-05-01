import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authenticatedGuard: CanMatchFn = async (route, segments) => {
   // Services
    const router: Router = inject(Router);
    
    const authService: AuthService = inject(AuthService);
    
    // Properties
    const isAuthenticated: boolean = await authService.checkStatus();
  
    if(!isAuthenticated){
      router.navigateByUrl('/auth/sign-in');
      return false;
    }
  
    return true;
};
