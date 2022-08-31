import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css']
})
export class BrandsComponent   implements OnInit {
  @Input() topBrands: any;
  public screenWidth: any;
  public screenHeight: any;
  loopComplete: boolean = false;
  currentSlideIndex:number=3;
  afterChange(e) {
    if (!this.loopComplete) {     
      this.loopComplete =(this.currentSlideIndex == this.brandsList.length)?true:false; 
      this.currentSlideIndex=this.currentSlideIndex+1;
    }
  }
  slideConfig2 = {
    autoplay: true, 
    slidesToShow: 5, 
    slidesToScroll: 1,  
    dots: false, 
    autoplaySpeed: 2000,
    nextArrow: `<div class="next" style=" position: absolute; top: -69px;
    left: auto;
    right: 35px;
    font-size: 12px;
    background: #f36523;
    width: 20px;
    height: 20px;
    text-align: center;
    color: #fff;
    border-radius: 50%;"><i class="fa fa-arrow-left slick-arrow slider-next"></i></div>`,
    prevArrow: `<div class="prev"  style=" position: absolute; top: -69px;
    left: auto;
    right: 0px;
    font-size: 12px;
    background: #f36523;
    width: 20px;
    height: 20px;
    text-align: center;
    color: #fff;
    border-radius: 50%;"><i class="fa fa-arrow-right slick-arrow slider-prev"></i></div>`,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };
  state:any;
  district:any;
  constructor(
    private homeService: HomeService,
    private globalService:GlobalService, 
    public router: Router) {    
  
   }
  brandsList:any=[]
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if(this.screenWidth<=292){
      this.currentSlideIndex=2;
    }
    else if(this.screenWidth>292 && this.screenWidth<=600){
      this.currentSlideIndex=2;
    }
    else if(this.screenWidth>600 && this.screenWidth<=1024){
      this.currentSlideIndex=3;
    }
    else{
      this.currentSlideIndex=5;
    }
   this.getTopListBrands()
   
  }

  getTopListBrands(){
    this.homeService.getTopBrands().subscribe((res: any) => {
      if(res.Status){
        this.brandsList = res.BZBrands.BZActiveBrands;
      }
    }, err => {
      console.log(err);
    })
  }


  goToBrandsProduct(id){
    //console.log('id', id);
    this.router.navigate(['/bz/brand-products', id])
  }

}
