import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from 'src/app/services/category.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent   implements OnInit {
  public screenWidth: any;
  public screenHeight: any;
  loopComplete: boolean = false;
  currentSlideIndex: number = 5;
  goToChatbot() {
    localStorage.setItem("LoginType", "500");
    let obj = {};
    obj["id"] = 0
    obj["typeId"] = 500
    this.globalService.onProductEnquiryClick(obj);
  }
  afterChange(e) {
    if (!this.loopComplete) {
      this.loopComplete = (this.currentSlideIndex == this.farmerCategoryList.length) ? true : false;
      this.currentSlideIndex = this.currentSlideIndex + 1;
    }
  }
  slideConfig = {
    autoplay: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    dots: false,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToScroll: 3,
          slidesToShow: 3
        }
      }
    ]
  };

  districtName: any;
  stateName: any;
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private categoryService: CategoryService) {

    this.globalService.defaultLocationObj.subscribe(res => {
      this.stateName = res["state"];
      this.districtName = res["district"];
      this.getFarmerCategoryList();
    });
  }


  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 292) {
      this.currentSlideIndex = 3;
    }
    else if (this.screenWidth > 292 && this.screenWidth <= 600) {
      this.currentSlideIndex = 3;
    }
    else if (this.screenWidth > 600 && this.screenWidth <= 1024) {
      this.currentSlideIndex = 5;
    }
    else {
      this.currentSlideIndex = 5;
    }
  }



  farmerCategoryList: any = []
  getFarmerCategoryList() {
    if (this.districtName && this.stateName) {
      this.categoryService.getFarmerCategoryList(this.districtName, this.stateName).subscribe((res: any) => {
        if (res.Status) {
          let data = res["Category"].Category;
          this.farmerCategoryList =  this.globalService.updateInArr(this.farmerCategoryList, data)
          // this.farmerCategoryList = res["Category"].Category; 

          this.categoryService.categoryList.next(this.farmerCategoryList);       
          for (let elem of this.farmerCategoryList) {
            if (elem.isKGP_Category === 0) {
              this.categoryService.sendMessage(true);
              break;
            } else {
              this.categoryService.sendMessage(false);
              break;
            }
          }
        }
      }, err => console.log(err));
    }
  }
  goToSubcategory(item) {
    localStorage.setItem('kgpStatus', item.isKGP_Category);
    this.router.navigate(['/bz/category', item.CategoryId], { queryParams: { category: item.Categoryname } });

  }

}

