import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable, BehaviorSubject } from "rxjs";
import { API_PATH } from '../utilis/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private subject = new Subject<any>();
  private locationSource = new Subject<any>();
  public categoryList: any = new Subject<any>();
  isLocation = this.locationSource.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }




  sendMessage(message: any) {
    this.subject.next({ text: message });
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  getFarmerCategoryList(district, state) {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": district,
        "state": state
      })
    }
    return this.http.get(API_PATH.farmerCategory, httpOptions);
  }

  getSubCategory(id) {
    return this.http.get(API_PATH.subCategories + id);
  }

  getSubCategoryProduct(categoryId) {
    const body = {
      "KGP_CategoryId": categoryId,
      "KGPCategory": [],
      "lang": "E",
      "userid": "",
      "version": "1"
    }
    return this.http.post(API_PATH.getSubCategoriesProductsByCategoryId, (body));
  }

  getHaryanCategoryProducts(catId, districtId) {
    const body = {
      "version": "1",
      "CategoryId": catId,
      "SubCategoryId": null,
      "DistrictId": districtId,
      "PageIndex": "1",
      "PageSize": "1000",

    }
    return this.http.get(API_PATH.haryanaCategoryProduct, { params: body })
  }

  getSubCategoriesFilter(id) {
    return this.http.get(API_PATH.getSubCategoryFilter + id);
  }

  getProductDetails(ProductId, Districtid, lat, lon) {
    const paramsData = {
      version: 1,
      ProductId: ProductId,
      Districtid: Districtid,
      lat: lat,
      lon: lon
    }
    return this.http.get(API_PATH.getProductDetails, {
      params: JSON.parse(JSON.stringify(paramsData)),
    })

    // return this.http.get(`${API_PATH.getProductDetails}ProductId=${ProductId}&Districtid=${Districtid}&lat=${lat}&lon=${lon}`)
  }

  getProductDetailsWithFarmerId(ProductId, Districtid, FarmerId, lat, lon) {
    let paramsData = {};
    paramsData["version"] = 1;
    paramsData["ProductId"] = ProductId;
    paramsData["Districtid"] = Districtid;
    paramsData["FarmerId"] = FarmerId;
    paramsData["lat"] = lat;
    paramsData["lon"] = lon;
    return this.http.get(API_PATH.getProductDetailsWithFarmerId, { params: paramsData });

  }

  getBestDeal(PackageId, MobileNo, buyerId, sellerId) {
    return this.http.get(API_PATH.getBestDeal + '?PackageID=' + PackageId + '&MobileNo=' + MobileNo + '&BuyerID=' + buyerId + '&SellerID=' + sellerId);
  }

  getFarmerAppServices(district, state) {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": district,
        "state": state
      })
    }
    return this.http.get(API_PATH.farmerAppServices, httpOptions)
  }

  getTodaysOffer(district, state, prodCount) {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": district,
        "state": state
      })
    }
    return this.http.get(API_PATH.GetTodayOfferProduct + '?Version=1&CategoryId=0&ProdCount=' + prodCount, httpOptions);
  }

  getTrendsProduct(district, state, prodCount) {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": district,
        "state": state
      })
    }
    return this.http.get(API_PATH.getTrendsProduct + prodCount, httpOptions);
  }

  getBrandWiseProducts(district, state, brandId, districtId) {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": district,
        "state": state
      })
    }
    //?version=1&CategoryId=0&BrandId=1428&DistrictId=716&PageIndex=1&PageSize=100
    return this.http.get(API_PATH.GetBrandWiseProduct + '?version=1&CategoryId=0&BrandId=' + brandId + '&DistrictId=' + districtId + '&PageIndex=1&PageSize=100', httpOptions);
  }


  getHarianaPromoProduct() {
    const httpOptions = {
      headers: new HttpHeaders({
        "district": 'Hisar',
        "state": 'HARYANA'
      })
    }
    return this.http.get(API_PATH.getProductDetailsWithFarmerId + '?Version=1&ProductId=3&DistrictId=716&lat=28.577437099999997&lon=77.0506877&FarmerId=0', httpOptions);
  }

  /*****/
  getPromoProductBeyondHariana(categoryId) {
    const body = {
      "KGP_CategoryId": categoryId,
      "KGPCategory": [],
      "lang": "E",
      "userid": "",
      "version": "1"
    }
    return this.http.post(API_PATH.getPromoProductBeyondHariana, (body));
  }


  sendEnquiry(data: any) {
    return this.http.get(API_PATH.sendEnquiry, { params: data });
  }





  productSearch(data: any) {
    return this.http.get(API_PATH.productSearch + 'farmerId=' + data.farmerId + '&categoryId=' + data.categoryId + '&stateName=' + data.stateName + '&districtName=' + data.districtName + '&searchText=' + data.searchText);
  }
  productDtlSearch(id: string, name: string, categoryId: number, farmerId: number) {
    return this.http.get(API_PATH.productDtlSearch + 'typeId=' + id.split('|')[1] + '&recordId=' + id.split('|')[0] + '&stateName=' + localStorage.getItem("SID") + '&districtName=' + localStorage.getItem("DID") + '&categoryId=' + categoryId + '&farmerId=' + farmerId + '&name=' + name);
  }
  getAdvisory() {
    return this.http.get(API_PATH.getAdvisory);
  }
  getAdvisoryDetail(id: any, districtIds) {
    return this.http.get(API_PATH.getAdvisoryDetail + 'CropId=' + id + '&DistrictId=' + districtIds+'&version=1&FarmerId=0');
  }
}
