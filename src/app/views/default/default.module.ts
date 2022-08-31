import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultRoutingModule } from './default-routing.module';
import { DefaultComponent } from './default.component';
import { BannersComponent } from './banners/banners.component'
import { CategoryListComponent } from './category-list/category-list.component';
import { PromoBannerComponent } from './promo-banner/promo-banner.component';
import { BrandsComponent } from './brands/brands.component';

import { LeadComponent } from './lead/lead.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { TopOfferProductsComponent } from './top-offer-products/top-offer-products.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatCarouselModule } from '@ngmodule/material-carousel';

@NgModule({
  declarations: [
    DefaultComponent,
    BannersComponent,
    CategoryListComponent,
    PromoBannerComponent,
    BrandsComponent,
    LeadComponent,
    TopOfferProductsComponent
  ],
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SlickCarouselModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    ShareButtonsModule.withConfig({
      debug: true
    }),
    ShareIconsModule,
    // BrowserAnimationsModule,
    MatCarouselModule.forRoot()
  ],
  exports: [
    DefaultComponent
  ]

})
export class DefaultModule { }
