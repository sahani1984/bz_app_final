import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';
import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-advisory',
  templateUrl: './advisory.component.html',
  styleUrls: ['./advisory.component.css']
})
export class AdvisoryComponent implements OnInit {
  subCategoryList: any = [];
  categoryId: any
  firstCategoryId: any
  productsList: any = [];

  selectedIndex: number = 0;
  filterData: any = [];
  subCategoryWrapper: boolean = true;
  filterWrapper: boolean = true;
  productWrapper: boolean = true;
  state: any;
  district: any
  latLong: any
  productCategoryTitle: any = '';
  subCategoryTitle: any = ''
  id: string = '';
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute, private metaService:MetaService
  ) {
    this.globalService.defaultLocationObj
      .subscribe(res => this.state = res["state"])

  }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/advisory', null);
    this.commonService.getLatLongMessage().subscribe((res: any) => {
      if (res) {
        this.latLong = res;
      }
    })
    this.getAdvisory();
  }

  getAdvisory() {
    this.productsList = [];
    this.categoryService.getAdvisory().subscribe(
      (res: any) => {
        if (res.BZApiReponse.CropList.length > 0) {
          this.productWrapper = true;
          this.productsList = res.BZApiReponse.CropList;
        } else {
          this.productWrapper = false;
        }
      }, err => console.log(err))
  }
  
  setIndex(index: number) {
    this.selectedIndex = index;
  }

  getSubCategoriesList() {
    this.categoryService.getSubCategory(this.categoryId).subscribe((res: any) => {
      this.subCategoryList = res.BZAppSubCatagory.BZFarmerAppSubCatagory;
      this.firstCategoryId = this.subCategoryList[0].CategoryID;
      this.subCategoryTitle = this.subCategoryList[0].CategoryName;
      if (this.firstCategoryId) {
        this.getSubCategoriesProducts(this.firstCategoryId);
        this.getSubCategoriesFilter(this.firstCategoryId);
      }

    }, err => {
      console.log(err);
    })
  }

  goToSubcategory(item) {
    this.subCategoryTitle = item.CategoryName;
    this.getSubCategoriesProducts(item.CategoryID);
    this.getSubCategoriesFilter(item.CategoryID);
  }


  getSubCategoriesProducts(id) {
    this.productsList = [];
    this.categoryService.getSubCategoryProduct(id).subscribe(
      (res: any) => {
        if (res.ProductsApiReponse.Product.length > 0) {
          this.productWrapper = true;
          this.productsList = res.ProductsApiReponse.Product;
        } else {
          this.productWrapper = false;
        }
      }, err => console.log(err))
  }

  getHaryanaProducts(catId, districtId) {
    this.categoryService.getHaryanCategoryProducts(catId, districtId).subscribe((res: any) => {
      if (res.Status) {
        this.productsList = res.ProductsApiReponse.Product;
      }
    }, err => console.log(err))
  }

  goToProdcutDetail(data) {
    if (data) {
      if (this.latLong) {
        this.commonService.sendLatLongMessage(this.latLong);
        localStorage.setItem('latData', this.latLong.lat);
        localStorage.setItem('longData', this.latLong.long);
      }
      this.router.navigate(['/bz/advisory-detail', data.CropID], { queryParams: { name: data.CropName } });
    }
  }

  getSubCategoriesFilter(id) {
    this.filterData = [];
    this.categoryService.getSubCategoriesFilter(id).subscribe((res: any) => {
      if (res.KGPApiReponse) {
        this.filterWrapper = true;
        this.filterData = res.KGPApiReponse;
      } else {
        this.filterWrapper = false;
      }
    }, err => console.log(err))
  }

}
