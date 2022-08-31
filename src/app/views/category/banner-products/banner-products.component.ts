import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-banner-products',
  templateUrl: './banner-products.component.html',
  styleUrls: ['./banner-products.component.css']
})
export class BannerProductsComponent   implements OnInit {
  categoryId:any;
  districtId:any;
  latLong:any;
  pageTitle:string=''
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute, private metaService:MetaService){

    this.route.queryParams.subscribe(res=> this.pageTitle = res["category"])
  }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/banner-products', null);
    this.districtId = localStorage.getItem('haryanaDistrictId');
    this.commonService.getLatLongMessage().subscribe((res: any) => {
      if(res){
        this.latLong = res;
      }
    })
    this.route.params.subscribe((res: any) => {
      if(res){
        this.categoryId = res.categoryId;
        this.getBannerProducts(this.categoryId, this.districtId);
      }
    });
  }

  /**BANNER CATEGORY ITEMS**/
  brandsProduct: any = [];
  getBannerProducts(categoryId, districtId){
    this.categoryService.getHaryanCategoryProducts(categoryId, districtId).subscribe((res: any) => {
      if(res.Status){
          this.brandsProduct = res.ProductsApiReponse.Product;
      }else{
        alert('Data not available')
      }
    })
  }

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
