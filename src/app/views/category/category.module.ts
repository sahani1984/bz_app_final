import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SubCategoriesComponent } from './sub-categories/sub-categories.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RouterModule } from '@angular/router';
import { CheckoutComponent } from './checkout/checkout.component';
import { SeeMoreComponent } from './see-more/see-more.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';
import { BannerProductsComponent } from './banner-products/banner-products.component';
import { PromoProductsComponent } from './promo-products/promo-products.component';
import { LazyLoadImageModule } from 'ng-lazyload-image'; 
import { SearchComponent } from './search/search.component';
import { AdvisoryComponent } from './advisory/advisory.component';
import { AdvisoryDetailComponent } from './advisory-detail/advisory-detail.component';
import { MaterialModule } from '../material.module';
import { ImgMagnifier } from "ng-img-magnifier";
import { SafeVideoPipe } from '../shared/pipes/safe-video.pipe';
import { ProfileComponent } from '../profile/profile.component';
@NgModule({
  declarations: [
    SubCategoriesComponent,
    ProductDetailComponent,
    CheckoutComponent,
    SeeMoreComponent,
    BrandProductsComponent,
    BannerProductsComponent,
    PromoProductsComponent,
    SearchComponent,
    AdvisoryComponent,
    AdvisoryDetailComponent ,
    SafeVideoPipe,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SlickCarouselModule,
    MaterialModule,
    RouterModule,
    LazyLoadImageModule, 
    ImgMagnifier
  ]
})
export class CategoryModule { }
