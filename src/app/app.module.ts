import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MaterialModule } from './views/material.module';
import {ToastrModule} from 'ngx-toastr';


// Component
import { AppComponent } from './app.component';
import { LayoutComponent } from './views/layout/layout.component';
import { HeaderComponent,HighlightPipe  } from './views/common/header/header.component';
import { FooterComponent } from './views/common/footer/footer.component';
// Modules component
import { SharedModule } from './views/shared/shared.module';
import { CategoryModule } from './views/category/category.module';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { LoaderComponent } from './views/common/loader/loader.component';
import { AgmCoreModule } from '@agm/core';
import { AboutComponent } from './views/about/about.component';
import {PrivacyPolicyComponent} from './views/privacy-policy/privacy-policy.component';
import {RefundPolicyComponent} from './views/refund-policy/refund-policy.component';
import {DeliveryPolicyComponent} from './views/delivery-policy/delivery-policy.component';
import {TermsAndConditionsComponent} from './views/terms-and-conditions/terms-and-conditions.component';
import {ContactUsComponent} from './views/contact-us/contact-us.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../app/views/login/login.component';
import { ProfileComponent } from '../app/views/profile/profile.component';
import { OrderHistoryComponent } from '../app/views/order-history/order-history.component';
import { NotificationsComponent } from '../app/views/notifications/notifications.component';
import { RegistrationProcessComponent } from '../app/views/registration-process/registration-process.component';
import  {StarRatingComponent} from './views/shared/star-rating/star-rating.component';
import {ClickElsewhereDirective} from './views/shared/directives/click-elsewhere.directive'
import { LocationComponent } from './views/common/location/location.component'

import { MessagingService } from './services/messaging.service';
import { AsyncPipe } from '@angular/common';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule, 
    MaterialModule,
    SharedModule,
    CategoryModule,
    SlickCarouselModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAgGdczxA0wa7WGNd1pjJ28Lw01a9aqNfY',
      libraries: ['places']
    }),
    ToastrModule.forRoot({
      timeOut:5000,
        progressBar:true,
        progressAnimation:"increasing"        
      }),
    RouterModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    HighlightPipe,
    FooterComponent,
    LoaderComponent,
    AboutComponent,
    LoginComponent,
    OrderHistoryComponent,
    NotificationsComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    DeliveryPolicyComponent,
    TermsAndConditionsComponent,
    ContactUsComponent,
    RegistrationProcessComponent,
    StarRatingComponent,
    ClickElsewhereDirective,
    LocationComponent
  ],
  entryComponents: [LoginComponent],
  providers: [HighlightPipe, MessagingService, AsyncPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
