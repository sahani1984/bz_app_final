import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute, NavigationEnd, RouterEvent} from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';

import { takeUntil } from 'rxjs/operators';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs-compat/operator/filter';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.css']
})
export class SubCategoriesComponent   implements OnInit {
  subCategoryList: any = [];
  categoryId: any
  firstCategoryId: any
  productsList: any = [];
  slideConfig = {
    autoplay: false, slidesToShow: 7, slidesToScroll: 1, dots: false, autoplaySpeed: 4000,
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
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3
        }
      }
    ]
  };
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
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private title:Title,
    private meta:Meta,
    private metaService:MetaService
  ) {

    this.globalService.defaultLocationObj.subscribe(res => this.state = res["state"])
    this.route.queryParams.subscribe(res => this.productCategoryTitle = res["category"])

  }
  goToEnquiry(id: number, typeId: number, categoryId?: number, dealerId?: number) {
    let obj = {};
    obj["id"] = id
    obj["typeId"] = typeId
    obj["categoyId"] = categoryId
    obj["dealerId"] = dealerId
    this.globalService.onProductEnquiryClick(obj);
  }
  ngOnInit(): void {   
    this.commonService.getLatLongMessage().subscribe((res: any) => {
      if (res) {
        this.latLong = res;
      }
    })

    this.route.params.subscribe((res: any) => {
      if (res && res.categoryId) {      
        this.globalService.onSelectCategoryClick(res.categoryId);
        this.categoryId = res.categoryId;
        const kgpStatus = localStorage.getItem('kgpStatus');
        if (kgpStatus == '1') {
          this.subCategoryWrapper = true;
          this.getSubCategoriesList();
        } else {
          this.subCategoryWrapper = false;
          const haryanaDistrictId = localStorage.getItem('haryanaDistrictId');
          this.getHaryanaProducts(this.categoryId, haryanaDistrictId);
          this.getSubCategoriesFilter(this.categoryId);
        }
      }
    });
    
    this.metaService.updateMeta('/bz/category', this.categoryId);
    this.router.events.subscribe((event) => {
      if(event  instanceof NavigationEnd)
        this.metaService.updateMeta('/bz/category', this.categoryId);        
      })
    
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
      let qString = { queryParams: { category: this.productCategoryTitle, name: data.ProductName } };
      if (this.subCategoryTitle != null && this.subCategoryTitle != '') {
        qString.queryParams["subcategory"] = this.subCategoryTitle;
      }
      this.router.navigate(['/bz/product-detail', data.RecordID], qString);
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


  updateMeta(){    
    if (this.categoryId == '1') { // agro chemical    
      this.title.setTitle('Buy Insecticides Online India - Behtar Zindagi');
      this.meta.updateTag({ name: "keywords", content: "buy insecticides online india" })
      this.meta.updateTag({ name: "description", content: "Behtar Zindagi is one of the online platform from where you can buy insecticides online India which is used to prevent crops from insect and doesn't harm the quality of crops." })
    }else if (this.categoryId == '4'){ // mashinary
      this.title.setTitle('Agricultural Equipment Manufacturers | Agriculture Fertilizer Shop Near Me');
      this.meta.updateTag({ name: "keywords", content:"agricultural equipment manufacturers,aagriculture fertilizer shop near me"})
      this.meta.updateTag({ name: "description", content:"Behtar Zindagi is one of the leading agricultural equipment manufacturers in India which is widely recommended by farmers for organic farming. For any query you can surf an agriculture fertilizer shop near me on google."})
    }else if (this.categoryId == '5') { // seed
      this.title.setTitle('Buy Plant, Vegetable, Cotton Seeds Online, Buy Seeds Online in India');
      this.meta.updateTag({ name: "keywords", content: "Buy Plant Seeds Online,Buy Seeds Online in India,Buy vegetable Seeds Online,Cotton Seeds Online" })
      this.meta.updateTag({ name: "description", content: "At Behtar Zindagi, you can buy seeds online in India. To buy plant, vegetable, cotton seeds online you can visit our website and can place orders for the same." })
    }else{
      this.title.setTitle('Behtar Zindagi, From Seeds to Market | Online marketplace for agriculture');
      this.meta.updateTag({ name: "keywords", content: "Farmer Product,agricultural products, machinery, equipment, poultry, Farmers Stop, insecticide, fungicides, herbicides, bactericides, pesticides, fertilizers" })
      this.meta.updateTag({
        name: "description", content: "Buy online seeds, agro tools and agro chemicals like vegetables seeds, shade nets, watering spray, nursery items, Cash Crop, Cattle Feed Supplements, Dairy, Drone, Farm Equipments, Field Crop, Fishery Products Flower Bulb Seeds, Flower Seeds, Fodder Seed, Fruit Seeds, Fungicides, Garden Tools, Gardening Equipments, Gardening Kit, Gold Loan, Harvesting Machines, Harvesting Tools, Herbicides, Insecticides, Inverter/Battery, Irrigation Equipments, Kitchen Garden Seeds, Loan Against Old Tractor Loan Against Property, Manures, Mobile Starter, New Tractor Loan, Oil Seed, Old Tractor, Old Tractor Loan, Organics, Personal Loan, Plant Protections, Plants, Pots & Planters, Poultry products, Pulses, Safety Products, Seeds, Sell Tractor, Solar, Sowing Equipments Spray Pumps, Tarpaulins, Tractor, Vegetable Seeds, Water Pumps" })
    }   
  }



}
