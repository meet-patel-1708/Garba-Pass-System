import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GeneratePassComponent } from './features/admin/generate-pass/generate-pass.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },

    { path: 'dashboard/:identityCardNumber', canActivate: [authGuard], loadComponent: () =>
        import('./features/admin/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
    },

    { path:'generate-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/admin/generate-pass/generate-pass.component')
        .then(c => c.GeneratePassComponent)
    },

    { path:'manage-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/admin/manage-pass/manage-pass.component')
        .then(c => c.ManagePassComponent)
    },

    { path:'register-pass', loadComponent:() =>
        import('./pages/register/register.component')
        .then(c => c.RegisterComponent)
    },

    { path:'view-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/user/view-pass/view-pass.component')
        .then(c => c.ViewPassComponent)
    },

    { path:'verify-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/user/verify-pass/verify-pass.component')
        .then(c => c.VerifyPassComponent)
    },
    { path:'buy-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/user/buy-pass/buy-pass.component')
        .then(c => c.BuyPassComponent)
    },
    { path:'sell-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/admin/sell-pass/sell-pass.component')
        .then(c => c.SellPassComponent)
    },

    { path:'block-unblock-pass', canActivate:[authGuard], loadComponent:() =>
        import('./features/admin/block-pass/block-pass.component')
        .then(c => c.BlockPassComponent)
    },
    { path:'home', canActivate:[authGuard], loadComponent:() =>
        import('./pages/home/home.component')
        .then(c => c.HomeComponent)
    },
];
