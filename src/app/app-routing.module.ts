import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from './views/layout/layout.component';
import { SubCategoriesComponent } from './views/category/sub-categories/sub-categories.component';
import { ProductDetailComponent } from './views/category/product-detail/product-detail.component';
import { AboutComponent } from './views/about/about.component';
import { PrivacyPolicyComponent } from './views/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './views/refund-policy/refund-policy.component';
import { DeliveryPolicyComponent } from './views/delivery-policy/delivery-policy.component';
import { ContactUsComponent } from './views/contact-us/contact-us.component';
import { TermsAndConditionsComponent } from './views/terms-and-conditions/terms-and-conditions.component';
import { CheckoutComponent } from './views/category/checkout/checkout.component';
import { SeeMoreComponent } from './views/category/see-more/see-more.component';
import { BrandProductsComponent } from './views/category/brand-products/brand-products.component';
import { BannerProductsComponent } from './views/category/banner-products/banner-products.component';
import { PromoProductsComponent } from './views/category/promo-products/promo-products.component';
import { ProfileComponent } from './views/profile/profile.component';
import { OrderHistoryComponent } from './views/order-history/order-history.component';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { LeadComponent } from './views/default/lead/lead.component';
import { SearchComponent } from './views/category/search/search.component';
import { AdvisoryComponent } from './views/category/advisory/advisory.component';
import { AdvisoryDetailComponent } from './views/category/advisory-detail/advisory-detail.component';
import { RegistrationProcessComponent } from './views/registration-process/registration-process.component';
import { CancelReturnComponent } from './views/cancel-return/cancel-return.component';
const routes: Routes = [

  {
    path: 'bz',
    component: LayoutComponent,
    children: [
      {
        path: 'category/:categoryId',
        component: SubCategoriesComponent
      },
      {
        path: 'search/:id',
        component: SearchComponent
      },
      {
        path: 'advisory',
        component: AdvisoryComponent
      },
      {
        path: 'advisory-detail/:categoryId',
        component: AdvisoryDetailComponent
      },
      {
        path: 'registration-process/:sourceId',
        component: RegistrationProcessComponent
      },
      {
        path: 'lead/:id',
        component: LeadComponent
      },
      {
        path: 'product-detail/:productId',
        component: ProductDetailComponent
      },
      {
        path: 'checkout/:productId',
        component: CheckoutComponent
      },
      {
        path: 'brand-products/:brandId',
        component: BrandProductsComponent
      },
      {
        path: 'banner-products/:categoryId',
        component: BannerProductsComponent
      },
      {
        path: 'banners-products/:subCategoryId',
        component: PromoProductsComponent
      },
      {
        path: 'see-more',
        component: SeeMoreComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'refund-policy',
        component: RefundPolicyComponent
      },
      {
        path: 'delivery-policy',
        component: DeliveryPolicyComponent
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent
      },
      {
        path: 'contact-us',
        component: ContactUsComponent
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'order-history', component: OrderHistoryComponent },
      { path: 'order-history/:ids', component: OrderHistoryComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'cancel-return-order', component: CancelReturnComponent }
    ]
  },
  { path: '', loadChildren: () => import('./views/default/default.module').then(m => m.DefaultModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
