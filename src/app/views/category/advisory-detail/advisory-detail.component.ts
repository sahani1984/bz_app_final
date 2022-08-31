import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-advisory-detail',
  templateUrl: './advisory-detail.component.html',
  styleUrls: ['./advisory-detail.component.css']
})
export class AdvisoryDetailComponent   implements OnInit {
  subCategoryList: any = [];
  categoryName:string='';
  categoryId: any
  firstCategoryId: any
  productsList: any = [];
  isLinear = false;
  selectedIndex: number = 0;
  filterData: any = [];
  subCategoryWrapper: boolean = true;
  filterWrapper: boolean = true;
  productWrapper: boolean = true;
  state: any;
  district: any;
  districtId:any;
  latLong: any
  productCategoryTitle: any = '';
  subCategoryTitle: any = ''
  id:string='';
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private metaService:MetaService
  ) {

    this.globalService.defaultLocationObj.subscribe(res => {
      console.log(res);
      this.state = res["state"];
      this.districtId = res["districtId"];
    })
    this.route.queryParams.subscribe(res => this.categoryName = res["name"])
    this.route.params.subscribe(res=>this.categoryId = res["categoryId"]); 
  }
  

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/advisory-detail', null);
    this.commonService.getLatLongMessage().subscribe((res: any) => {
      if (res) {
        this.latLong = res;
      }
    })
  this.getAdvisoryDtls();
  }

  getAdvisoryDtls() {
    this.productsList = [];
    this.categoryService.getAdvisoryDetail(this.categoryId, this.districtId).subscribe(
      (res: any) => {
        console.log(res);
        if (res.Results.BZStageCrop.length > 0) {
          this.productWrapper = true;
          this.productsList = res.Results.BZStageCrop;
          console.log('detail advisory data',this.productsList);
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
      let qString={queryParams:{category:this.productCategoryTitle,name:data.ProductName}};
      if(this.subCategoryTitle!=null && this.subCategoryTitle!=''){
        qString.queryParams["subcategory"]=this.subCategoryTitle;
      }
      this.router.navigate(['/bz/product-detail', data.RecordID],qString );
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

  goToEnquiry(id: number, typeId: number, categoryId?: number, dealerId?: number) {
    let obj = {};
    obj["id"] = id;
    obj["typeId"] = typeId;
    obj["categoyId"] = categoryId;
    obj["dealerId"] = dealerId;
    this.globalService.onProductEnquiryClick(obj);
  }

}
