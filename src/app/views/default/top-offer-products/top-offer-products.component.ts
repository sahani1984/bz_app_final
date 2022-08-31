import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-top-offer-products',
  templateUrl: './top-offer-products.component.html',
  styleUrls: ['./top-offer-products.component.css']
})
export class TopOfferProductsComponent implements OnInit {
  state: any;
  district: any;''
  latLong: any;
  public panIndiaProduct:boolean = true;
  public slideConfig = {};  

  constructor(private homeService:HomeService,
    private categoryService:CategoryService,
    private globalService:GlobalService,
    private commonService:CommonService,
    private router:Router) {
    this.slideConfig = this.sliderConfig();
    this.globalService.defaultLocationObj.subscribe(res => {
      if (res) {
        this.state = res["state"];
        this.district = res["district"];
        if (this.state && this.district) {
          if(this.state.toLowerCase() == 'haryana'){
            this.panIndiaProduct = false;
            this.getTodaysOffer();
            this.getTrendsProduct();
          }else{
            this.panIndiaProduct = true;
            this.getTopSellingProducts();
            this.getBehtarBachatProducts();
          }        
        }
      }
    });
     }

  ngOnInit(): void {
    
  }

/**PAN INDIA PRODUCT OFFER**/
  /**SELLING PRODUCTS**/
  sellingProducts: any = []
  getTopSellingProducts() {
    this.homeService.getTopSellingProducts(this.district, this.state, 0).subscribe((res: any) => {
      this.sellingProducts = res.ProductsApiReponse.Product;
      console.log(this.sellingProducts);
    }, err => {
      console.log(err);
    })
  }

  /**GET BEHTAR BACHAT PRODUCTS**/
  behtarBachatProducts: any = []
  getBehtarBachatProducts() {
    this.homeService.getBehtarBachatProducts(this.district, this.state, 0)
      .subscribe((res: any) => {
        this.behtarBachatProducts = res.ProductsApiReponse.Product;
        console.log(this.behtarBachatProducts);
      }, err => {
        console.log(err);
      })
  }


  /**HARYANA PRODUCT OFFER**/
    /**TODAYS OFFTER**/
  todaysOffer: any = [];
  getTodaysOffer() {
    console.log(this.district, this.state)
    this.categoryService.getTodaysOffer(this.district, this.state, 0).subscribe((res: any) => {
      if (res.Status) {
        this.todaysOffer = res.ProductsApiReponse.Product;
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
        this.trendProducts = res.ProductsApiReponse.Product;
      }
    }, err => {
      console.log(err);
    })
  }


  /**GO TO DETAILS PAGE**/
  goToDetailPage(id, category, name) {
    if (this.latLong) {
      localStorage.setItem('latData', this.latLong.lat);
      localStorage.setItem('longData', this.latLong.long);
    }
    this.router.navigate(['/bz/product-detail', id], { queryParams: { category: category, name: name } })
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

  /**TO TO SEE MORE**/
  goToSeeMore(value) {
    localStorage.setItem('see-more', value);
    this.commonService.sendSeeMoreMessage(value);
    this.router.navigate(['/bz/see-more']);
  }


  sliderConfig(){     
    let obj = {};
    obj["autoplay"] = true;
    obj["slidesToShow"] = 5;
    obj["slidesToScroll"] = 1;
    obj["dots"] = false;
    obj["autoplaySpeed"] = 5000;
    obj["nextArrow"] = `<div class="slide_next"><i class="fa fa-arrow-left slick-arrow slider-next"></i></div>`,
      obj["prevArrow"] = `<div class="slide_next"><i class="fa fa-arrow-right slick-arrow slider-prev"></i></div>`,
    obj["responsive"] = [
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
    return obj;   
  }
  

}
