import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { dashboardGuard } from './shared/guard/dashboard.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/blank-layout/blank-layout.component').then(
        (m) => m.BlankLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () =>
          import('./components/shoes/shoes.component').then(
            (m) => m.ShoesComponent
          ),
        title: 'Levado home',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/products/products.component').then(
            (m) => m.ProductsComponent
          ),
        title: 'Products',
      },
      {
        path: 'category/products/:id',
        loadComponent: () =>
          import(
            './components/category-product/category-product.component'
          ).then((m) => m.CategoryProductComponent),
        title: 'Category Products',
      },

      {
        path: 'brands',
        loadComponent: () =>
          import('./components/brands/brands.component').then(
            (m) => m.BrandsComponent
          ),
        title: 'Brands',
      },
      {
        path: 'brand/products/:id',
        loadComponent: () =>
          import('./components/brand-product/brand-product.component').then(
            (m) => m.BrandProductComponent
          ),
        title: 'Brand Products',
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./components/about/about.component').then(
            (m) => m.AboutComponent
          ),
        title: 'About Levado',
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./components/cart/cart.component').then(
            (m) => m.CartComponent
          ),
        title: 'Cart',
      },
      {
        path: 'checkOut/:id',
        loadComponent: () =>
          import('./components/checkout/checkout.component').then(
            (m) => m.CheckoutComponent
          ),
        title: 'Cart',
      },
      {
        path: 'payment-success/:id',
        loadComponent: () =>
          import('./components/payment-success/payment-success.component').then(
            (m) => m.PaymentSuccessComponent
          ),
        title: 'Cart',
      },

      {
        path: 'account',
        loadComponent: () =>
          import('./components/account/account.component').then(
            (m) => m.AccountComponent
          ),
        title: 'Cart',
        children: [
          { path: '', redirectTo: 'Account', pathMatch: 'full' },
          {
            path: 'Account',
            loadComponent: () =>
              import('./components/user-account/user-account.component').then(
                (m) => m.UserAccountComponent
              ),
          },
          {
            path: 'orders',
            loadComponent: () =>
              import('./components/orders/orders.component').then(
                (m) => m.OrdersComponent
              ),
          },
          {
            path: 'orderDetails/:id',
            loadComponent: () =>
              import('./components/order-details/order-details.component').then(
                (m) => m.OrderDetailsComponent
              ),
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import('./components/notifications/notifications.component').then(
                (m) => m.NotificationsComponent
              ),
          },
          {
            path: 'wishlist',
            loadComponent: () =>
              import('./components/wishlist/wishlist.component').then(
                (m) => m.WishlistComponent
              ),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import('./components/settings/settings.component').then(
                (m) => m.SettingsComponent
              ),
          },
        ],
      },
      {
        path: 'wishlist',
        loadComponent: () =>
          import('./components/wishlist/wishlist.component').then(
            (m) => m.WishlistComponent
          ),
        title: 'Wishlist',
      },
      {
        path: 'product/details/:slug/:currency',
        loadComponent: () =>
          import('./components/product-details/product-details.component').then(
            (m) => m.ProductDetailsComponent
          ),
        title: 'Shoes Details',
      },
    ],
  },
  {
    path: '',
    canActivate: [dashboardGuard],
    loadComponent: () =>
      import('./components/dashboard/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),

    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/pages/home/home.component').then(
            (m) => m.HomeComponent
          ),
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          {
            path: 'home',
            loadComponent: () =>
              import(
                './components/dashboard/pages/dashboard-charts/dashboard-charts.component'
              ).then((m) => m.DashboardChartsComponent),
            title: 'Admin Dashboard',
          },
          {
            path: 'orders',
            loadComponent: () =>
              import(
                './components/dashboard/pages/orders/orders.component'
              ).then((m) => m.OrdersComponent),
            title: 'Orders Dashboard',
          },
          {
            path: 'orderDetails/:oid',
            loadComponent: () =>
              import(
                './components/dashboard/pages/order-details/order-details.component'
              ).then((m) => m.OrderDetailsComponent),
            title: 'order-details Dashboard',
          },

          {
            path: 'addproduct',
            loadComponent: () =>
              import(
                './components/dashboard/pages/addeditproduct/addeditproduct.component'
              ).then((m) => m.AddeditproductComponent),
            title: 'add Product Dashboard',
          },
          {
            path: 'addproduct/:id',
            loadComponent: () =>
              import(
                './components/dashboard/pages/addeditproduct/addeditproduct.component'
              ).then((m) => m.AddeditproductComponent),
            title: 'add Product Dashboard',
          },
          {
            path: 'vendorCoupons',
            loadComponent: () =>
              import(
                './components/dashboard/pages/vendor-coupons/vendor-coupons.component'
              ).then((m) => m.VendorCouponsComponent),
            title: 'vendor Coupons',
          },
          {
            path: 'vendorNotifications',
            loadComponent: () =>
              import(
                './components/dashboard/pages/vendor-notifications/vendor-notifications.component'
              ).then((m) => m.VendorNotificationsComponent),
            title: 'vendor Coupons',
          },
        ],
      },
    ],
  },

  {
    path: '',
    loadComponent: () =>
      import('./components/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'login',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        title: 'register',
      },
      {
        path: 'forgetPassword',
        loadComponent: () =>
          import('./components/forgetpassword/forgetpassword.component').then(
            (m) => m.ForgetpasswordComponent
          ),
        title: 'forget password',
      },
      {
        path: 'create-new-password',
        loadComponent: () =>
          import('./components/newpassword/newpassword.component').then(
            (m) => m.NewpasswordComponent
          ),
        title: 'Create new Password',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/notfound/notfound.component').then(
        (m) => m.NotfoundComponent
      ),
    title: 'Not Found',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
