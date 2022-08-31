import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { take } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css'],

})
export class DefaultComponent implements OnInit {
  public screenWidth: any;
  public screenHeight: any;
  loopComplete: boolean = false;
  currentSlideIndex: number = 5;


  slideConfig = {
    autoplay: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    autoplaySpeed: 5000,
    nextArrow: `<div class="slide_next"><i class="fa fa-arrow-left slick-arrow slider-next"></i></div>`,
    prevArrow: `<div class="slide_prev"><i class="fa fa-arrow-right slick-arrow slider-prev"></i></div>`,
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
          slidesToShow: 1
        }
      }
    ]
  };


  loopBehtarBachatComplete: boolean = false;
  currentBehtarBachatSlideIndex: number = 5;

  afterBehtarBachatChange(e) {
    if (!this.loopBehtarBachatComplete) {
      this.loopBehtarBachatComplete = (this.currentBehtarBachatSlideIndex == this.behtarBachatProducts.length) ? true : false;
      this.currentBehtarBachatSlideIndex = this.currentBehtarBachatSlideIndex + 1;
    }
  }
  
  loopTodaysOfferComplete: boolean = false;
  currentTodaysOfferSlideIndex: number = 5;
  afterTodaysOfferChange(e) {
    if (!this.loopTodaysOfferComplete) {
      this.loopTodaysOfferComplete = (this.currentTodaysOfferSlideIndex == this.todaysOffer.length) ? true : false;
      this.currentTodaysOfferSlideIndex = this.currentTodaysOfferSlideIndex + 1;
    }
  }

  loopTrendProductComplete: boolean = false;
  currentTrendProductSlideIndex: number = 5;
  afterTrendProductChange(e) {
    if (!this.loopTrendProductComplete) {
      this.loopTrendProductComplete = (this.currentTrendProductSlideIndex == this.trendProducts.length) ? true : false;
      this.currentTrendProductSlideIndex = this.currentTrendProductSlideIndex + 1;
    }
  }
  
  state: any;
  district: any;
  todaysOfferWrapper: boolean = false;
  latLong: any;
  constructor(private homeService: HomeService,
    private commonService: CommonService,
    private globalService: GlobalService,
    private router: Router,
    private title:Title,
    private meta:Meta,
    private categoryService: CategoryService, private metaService:MetaService) {
    this.globalService.defaultLocationObj.subscribe(res => {
      if (res) {       
        this.state = res["state"];
        this.district = res["district"];
        if (this.state && this.district) {
          if(this.state.toLowerCase() == 'haryana'){
            this.todaysOfferWrapper = true;
            this.getTodaysOffer();
            this.getTrendsProduct();
          }else{
            this.todaysOfferWrapper = false;
            this.getTopSellingProducts();
            this.getBehtarBachatProducts();
          }        
        }
      }
    });


  }

  ngOnInit(): void {  
    this.metaService.updateMeta('/', null);   
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 292) {
      this.currentSlideIndex = 1;
      this.currentBehtarBachatSlideIndex = 1;
      this.currentTodaysOfferSlideIndex = 1;
      this.currentTrendProductSlideIndex = 1;
    }
    else if (this.screenWidth > 292 && this.screenWidth <= 600) {
      this.currentSlideIndex = 2;
      this.currentBehtarBachatSlideIndex = 2;
      this.currentTodaysOfferSlideIndex = 2;
      this.currentTrendProductSlideIndex = 2;
    }
    else if (this.screenWidth > 600 && this.screenWidth <= 1024) {
      this.currentSlideIndex = 3;
      this.currentBehtarBachatSlideIndex = 3;
      this.currentTodaysOfferSlideIndex = 3;
      this.currentTrendProductSlideIndex = 3;
    }
    else {
      this.currentSlideIndex = 5;
      this.currentBehtarBachatSlideIndex = 5;
      this.currentTodaysOfferSlideIndex = 5;
      this.currentTrendProductSlideIndex = 5;
    }
    /**SET LAT-LONG**/
    this.commonService.getLatLongMessage()
      .pipe(take(1)).subscribe((res: any) => {
        if (res) {
          this.latLong = res;
        }
      })


    

  
    setTimeout(() => {
      this.globalService.isRedirectedformTractor.next(true);
    }, 10000)

  }


  afterChange(e) {
    if (!this.loopComplete) {
      this.loopComplete = (this.currentSlideIndex == this.sellingProducts.length) ? true : false;
      this.currentSlideIndex = this.currentSlideIndex + 1;
    }
  }


  /**GET SELLING PRODUCTS**/
  sellingProducts: any = []
  getTopSellingProducts() {
    this.homeService.getTopSellingProducts(this.district, this.state, 0).subscribe((res: any) => {
      let data = res.ProductsApiReponse.Product;
      this.sellingProducts = this.globalService.updateInArr(this.sellingProducts, data);    
      
    }, err => {
      console.log(err);
    })
  }


  /**GET BEHTAR BACHAT PRODUCTS**/
  behtarBachatProducts: any = []
  getBehtarBachatProducts() {
    this.homeService.getBehtarBachatProducts(this.district, this.state, 0)
      .subscribe((res: any) => {
        let data = res.ProductsApiReponse.Product;
        this.behtarBachatProducts  = this.globalService.updateInArr(this.behtarBachatProducts, data);       
      
      }, err => {
        console.log(err);
      })
  }


  /**GET TODAYS OFFTER**/
  todaysOffer: any = [];
  getTodaysOffer() { 
    this.categoryService.getTodaysOffer(this.district, this.state, 0).subscribe((res: any) => {
      if (res.Status) {
        let data = res.ProductsApiReponse.Product;
        this.todaysOffer = this.globalService.updateInArr(this.todaysOffer, data);
        // this.todaysOffer = res.ProductsApiReponse.Product;
      }
    }, err => {
      console.log(err);
    })
  }


  /**GET TREND PRODUCTS**/
  trendProducts: any = [];
  getTrendsProduct() {
    this.categoryService.getTrendsProduct(this.district, this.state, 0).subscribe((res: any) => {
      if (res.Status) {
        let data = res.ProductsApiReponse.Product;
        this.trendProducts = this.globalService.updateInArr(this.trendProducts, data);
        // this.trendProducts = res.ProductsApiReponse.Product;
      }
    }, err => {
      console.log(err);
    })
  }


  /**GO TO ENQUIRY PAGE**/
  goToEnquiry(id: number, typeId: number, categoryId?: number, dealerId?: any) {
    let obj = {};
    obj["id"] = id
    obj["typeId"] = typeId
    obj["categoyId"] = categoryId
    obj["dealerId"] = dealerId
    this.globalService.onProductEnquiryClick(obj);
  }



  /**GO TO DETAILS PAGE**/
  goToDetailPage(id, category, name) {
    if (this.latLong) {
      localStorage.setItem('latData', this.latLong.lat);
      localStorage.setItem('longData', this.latLong.long);
    }
    this.router.navigate(['/bz/product-detail', id], { queryParams: { category: category, name: name } })
  }



  /**TO TO SEE MORE**/
  goToSeeMore(value) {
    localStorage.setItem('see-more', value);
    this.commonService.sendSeeMoreMessage(value);
    this.router.navigate(['/bz/see-more']);
  }

   updateMeta(){
     this.title.setTitle('Seeds and Fertilizer Shop Near Me, Indian Vegetable Seeds Online');
     this.meta.updateTag({ name: 'keywords', content:"fertilizer shop near me,indian vegetable seeds online,seeds and fertilizer shop near me"})
     this.meta.updateTag({ name: 'description', content:"To buy Indian vegetable seeds online, Behtar Zindagi is a one stop solution for you.If you are looking for seeds and fertilizers shop near me, then just visit our website"})
   }


}
