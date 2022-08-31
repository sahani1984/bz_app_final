
import {Component, OnInit} from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { HomeService } from 'src/app/services/home.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { interval } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.css']
})
export class SeeMoreComponent    implements OnInit {
  productsList: any = [];
  district:any;
  state:any;
  seeMoreText:any;
  constructor(private commonService: CommonService,
    private globalService:GlobalService,
    private homeService: HomeService, 
    private categoryService: CategoryService, 
    private router: Router, private metaService:MetaService) {
  
      this.globalService.defaultLocationObj.subscribe((res:any)=>{     
        if(Object.keys(res).length){      
            this.state = res["state"];
            this.district = res["district"];      
         } 
       })    
  }

  ngOnInit(): void {   
    this.metaService.updateMeta('/bz/see-more', null);
     const source$ = interval(300).subscribe(res=>{      
      this.getSeeMoreItems(this.district, this.state);
      if(this.state !== undefined || this.state !== null || this.state !== ''){
        source$.unsubscribe();
      }
     })    
  }

  getSeeMoreItems(district, state){    
    const seeMore = localStorage.getItem('see-more'); 
    if(district && state){  
    if(seeMore == 'top-selling'){
      this.getTopSellingProducts(district, state);
      this.seeMoreText = 'सबसे ज़्यादा बिकने वाले उत्पाद';
    }
    if(seeMore == 'haryana-todays-offer'){
      this.getTodaysOffer(district, state);
      this.seeMoreText = 'आज के ऑफर-सिर्फ आपके लिए';
    }
    if(seeMore == 'behtar-bachat'){
       this.getBehtarBachatProducts(district, state); 
      this.seeMoreText = 'बेहतर बचत ऑफर';  
    }
    if(seeMore == 'most-sellings'){
      this.getTrendsProduct(district, state); 
      this.seeMoreText = 'सर्वाधिक बिकने वाले उत्पाद';    
    }
  }
  }



  getTopSellingProducts(district, state){
    this.homeService.getTopSellingProducts(district, state, 1).subscribe((res: any) => {
      this.productsList = res.ProductsApiReponse.Product;
    }, err =>console.log(err))
   }
 
   getBehtarBachatProducts(district, state){
     return this.homeService.getBehtarBachatProducts(district, state, 1).subscribe((res: any) => {
       this.productsList = res.ProductsApiReponse.Product;
      }, err =>console.log(err))
   }
 
   getTodaysOffer(district, state){
     this.categoryService.getTodaysOffer(district, state, 1).subscribe((res: any) => {
       if(res.Status){
         this.productsList = res.ProductsApiReponse.Product;
       }
      
      }, err =>console.log(err))
   }
 
   getTrendsProduct(district, state){
     this.categoryService.getTrendsProduct(district, state, 1).subscribe((res: any) => {
       if(res.Status){
         this.productsList = res.ProductsApiReponse.Product;
       }
      }, err =>console.log(err))
   }

   goToDetailPage(id){
     this.router.navigate(['/bz/product-detail', id]);
   }

}
