import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { DialogComponent } from './dialog/dialog.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SafeurlPipe } from './pipes/safeurl.pipe';




@NgModule({
  declarations: [
    DialogComponent,
    SafeurlPipe   
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LazyLoadImageModule
  ],
  exports:[LazyLoadImageModule],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SharedModule { }
