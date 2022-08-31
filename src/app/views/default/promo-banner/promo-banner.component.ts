import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { HomeService } from 'src/app/services/home.service';
import { take, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/app/services/common.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-promo-banner',
  templateUrl: './promo-banner.component.html',
  styleUrls: ['./promo-banner.component.css']
})
export class PromoBannerComponent   implements OnInit {
  state: any;
  district: any;
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private homeService: HomeService,
    private commonService: CommonService) {
    this.globalService.defaultLocationObj.subscribe(res => {
      this.state = res["state"];
      this.district = res["district"];
      this.getPromoBanners(this.district, this.state);
    });
  }
  latLong: any;
  ngOnInit(): void {
    /**SET LAT-LONG**/
    this.commonService.getLatLongMessage()
      .pipe(take(1))
      .subscribe((res: any) => {
        //console.log(res);  
        if (res) {
          this.latLong = res;
        }
      })
  }

  /**GET PROMO BANNERS**/
  promoBanners: any = []
  getPromoBanners(district, state) {
    if (district && state) {
      this.homeService.getPromoBanners(district, state)
        .pipe(take(1))
        .subscribe((res: any) => {
          if (res.Status) {
            let data = res.BZBanner.BzBanner;
            this.promoBanners  = this.globalService.updateInArr(this.promoBanners, data);      
          }
        }, err => console.log(err))
    }
  }

  /**GO TO BANNER CATEGORY**/
  goToCategory(item) {
    if (item.SubCategoryId && (item.bannerCategory == 'kitchen_garden')) {
      this.router.navigate(['/bz/banners-products', item.SubCategoryId], { queryParams: { category: item.Category } });
    } else {
      if (this.latLong) {
        localStorage.setItem('latData', this.latLong.lat);
        localStorage.setItem('longData', this.latLong.long);
      }
      this.router.navigate(['/bz/product-detail', item.ProductId], { queryParams: { category: item.Category } })
    }

  }

}
