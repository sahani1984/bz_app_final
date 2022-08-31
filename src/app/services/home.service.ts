import { Injectable } from '@angular/core';
import { API_PATH } from '../utilis/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
@Injectable({
  providedIn: 'root'
})

export class HomeService {
  constructor(private http: HttpClient) { }
  
  httpOptions(district, state){
    const httpHeader = { 
      headers: new HttpHeaders({"district": district, "state": state })
    }
    return httpHeader;
  }

  getStateList(){
    return this.http.get(API_PATH.statesList);
  }

  getBannersLists(district, state){   
     return this.http.get(API_PATH.bannersList, this.httpOptions(district, state));
  }

  getPromoBanners(district, state){    
    return this.http.get(API_PATH.getPromoBanners, this.httpOptions(district, state));
  }

  getTopSellingProducts(district, state, prodCount){
     return this.http.get(API_PATH.topSellingProducts+prodCount, this.httpOptions(district, state));
  }


  getBehtarBachatProducts(district, state, prodCount){   
    return this.http.get(API_PATH.behtarBachatProducts+prodCount, this.httpOptions(district, state))
    
  }

  getTopBrands(){
    return this.http.get(API_PATH.topBrands);
  }

  getDistrictList(stateId){
    return this.http.get(API_PATH.districtList+`&Id=${stateId}&Type=D`);
  }
  
  GetBrandWiseProduct(brandId, DistrictId){
    return this.http.get(API_PATH.GetBrandWiseProduct + '?version=1&CategoryId=0&BrandId=' + brandId + '&DistrictId=' + DistrictId + '&PageIndex=1&PageSize=100')
  }
  getLeadGeneration(pData:any){
    return this.http.get(API_PATH.GetLeadGeneration + 'purchaseDays='+pData["purchaseDays"]+'&brandProduct='+pData["brandProduct"]+'&name=' + pData["name"] + '&mob=' + pData["mob"] + '&mailid='+pData["email"]+'&state='+pData["state"]+'&district='+pData["district"]+'&village='+pData["village"]+'&leadSourceId='+pData["leadSourceId"])
  }

}
