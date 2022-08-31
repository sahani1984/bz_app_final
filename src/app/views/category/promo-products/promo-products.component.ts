import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
//import 'rxjs/add/operator/filter';
import { take, takeUntil } from 'rxjs/operators';

import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-promo-products',
  templateUrl: './promo-products.component.html',
  styleUrls: ['./promo-products.component.css']
})
export class PromoProductsComponent   implements OnInit {
  subCategoryId:any  
  latLong:any  
  pageTitle:string = ''
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private router: Router, private metaService:MetaService,
    private route: ActivatedRoute) {

    this.route.queryParams.subscribe(res=>{
     this.pageTitle =  res["category"]   
    }) 
   }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/banners-products', null);
    this.commonService.getLatLongMessage()
    .pipe(take(1))
    .subscribe((res: any) => {
      console.log(res);
      if(res){
        this.latLong = res;
      }
    })
    this.route.params.subscribe((res: any) => {    
      if(res){
        this.subCategoryId = res.subCategoryId;
        this.getSubCategoriesProducts(this.subCategoryId)
      }
    });
  }

  /**GET SUBCATEGORY PRODUCTS**/
  brandsProduct: any = [];
  getSubCategoriesProducts(id){
    this.categoryService.getPromoProductBeyondHariana(id).subscribe((res:any) => {  
      console.log(res);
      if(res.Status){
        this.brandsProduct = res.KGPApiReponse.KGPResponse;
        console.log(this.brandsProduct);
      }      
    }, err => console.log(err))    
  }

/**GO TO PRODUCT DETAILS**/
  goToProdcutDetail(data){
    if(data){
      if(this.latLong){
        this.commonService.sendLatLongMessage(this.latLong);
        localStorage.setItem('latData', this.latLong.lat);
        localStorage.setItem('longData', this.latLong.long);
      }
      this.router.navigate(['/bz/product-detail', data.RecordID]);
    }
  }

}
