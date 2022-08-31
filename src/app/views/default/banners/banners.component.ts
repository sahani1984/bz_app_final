import { Component, OnInit, Input } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { CommonService } from 'src/app/services/common.service';
import { CategoryService } from 'src/app/services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { take, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.css']
})
export class BannersComponent implements OnInit {
  public screenWidth: any;
  public screenHeight: any;
  @Input() banners = [];
  loopComplete: boolean = false;
  currentSlideIndex: number = 3;
  afterChange(e) {
    if (!this.loopComplete) {
      this.loopComplete = (this.currentSlideIndex == this.bannersList.length) ? true : false;
      this.currentSlideIndex = this.currentSlideIndex + 1;
    }
  }
  slideConfig = {
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    autoplaySpeed: 4000,
    "nextArrow": '<i class="fa fa-angle-right nextBtn" aria-hidden="true"></i>',
    "prevArrow": '<i class="fa fa-angle-left prevBtn" aria-hidden="true"></i>',
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


  state: any;
  district: any;
  districtId: any;
  constructor(
    private homeService: HomeService,
    private commonService: CommonService,
    private categoryService: CategoryService,
    private globalService: GlobalService,
    public dialog: MatDialog,
    private router: Router) {
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 292) {
      this.currentSlideIndex = 1;
    }
    else if (this.screenWidth > 292 && this.screenWidth <= 600) {
      this.currentSlideIndex = 2;
    }
    else if (this.screenWidth > 600 && this.screenWidth <= 1024) {
      this.currentSlideIndex = 3;
    }
    else {
      this.currentSlideIndex = 2;
    }
    this.globalService.defaultLocationObj.subscribe((res: any) => {
      this.state = res["state"];
      this.district = res["district"];
      this.getBannersData(this.district, this.state);
    });
    this.globalService.isLocationChange.subscribe((res: any) => {
      if (res) {
        this.getBannersData(this.district, this.state);
      }
    });

  }

  navigateToProduct(productUrl){  
    //productUrl = "https://behtarzindagi.in/index/bz/product-detail/7642?category=कृषि मशीनें"
     let urlArr = productUrl?.split('/');
    let el = urlArr[urlArr.length - 1];
    let productIds = el?.split('?')[0];
    let cat = el?.split('?')[1]?.split('=')[1];
    this.router.navigate(['/bz/product-detail', productIds], { queryParams: { category: cat} })
  }

 

  /**GET BANNER LIST**/
  bannersList: any = []
  getBannersData(district, state) {
    if (district && state) {
      this.homeService.getBannersLists(district, state)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.Status) {
            let data = res["BZAppBanner"].BZProductBanner;
           this.bannersList =  this.globalService.updateInArr(this.bannersList, data);
            console.log(this.bannersList)
            // this.bannersList = res["BZAppBanner"].BZProductBanner;
          }
        }, err => console.log(err))
    }
  }

  goToCategory(item) {
    if (item) {
      this.router.navigate(['/bz/banner-products', item.CategoryId], { queryParams: { category: item.CategoryName } });
    } else {
      alert('Data not available');
    }
  }



  /**FOR TRACKING EXISTING ITEM AND IGNORE DOM RENDERING**/
  trackByImage(index: number, item: any): string {
    return item.ImagePath && item.CategoryId;
  }

}
