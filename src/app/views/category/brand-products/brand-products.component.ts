import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import {LocationStrategy} from '@angular/common';
import { GlobalService } from 'src/app/services/global.service';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.css']
})
export class BrandProductsComponent   implements OnInit {
  brandId;
  state;
  district;
  brandsProduct: any = [];
  districtId;
  latLong;
  categoryId;
  subCategoryId;

  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private url:LocationStrategy,
    private globalService: GlobalService,
    private metaService:MetaService
  ) { 

  }
  goToEnquiry(id:number, typeId:number, categoryId?:number, dealerId?:number ){
    let obj = {};
    obj["id"] = id
    obj["typeId"] = typeId
    obj["categoyId"] = categoryId
    obj["dealerId"] =dealerId
    this.globalService.onProductEnquiryClick(obj);
  }
  ngOnInit(): void {
    this.metaService.updateMeta('/bz/brand-products', null);
    const state = localStorage.getItem('state');
    const district = localStorage.getItem('district');
    this.districtId = localStorage.getItem('haryanaDistrictId');
    this.commonService.getLatLongMessage().subscribe((res: any) => {
      if(res){
        this.latLong = res;
      }
    })
    this.route.params.subscribe((res: any) => {
      if(res){
        this.brandId = res.brandId;
        if(state && district){
          this.state = state;
          this.district = district;
          this.getbrandProducts(this.state, this.district, this.brandId, this.districtId);
        }else{
          this.commonService.getLocationMessage().subscribe((res) => {
            if(res){
              this.state = res.state;
              this.district = res.district;
              this.getbrandProducts(this.state, this.district, this.brandId, this.districtId);
            }
          })
        }
      }
    })
   
 
  }

  getbrandProducts(state, district, brandId, districtId){
    this.categoryService.getBrandWiseProducts(state, district, brandId, districtId).subscribe((res: any) => {
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
