import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {API_PATH} from '../utilis/app.config'
import { Subscription } from 'rxjs/internal/Subscription';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

public filterObj:any  = new BehaviorSubject({});
public defaultLocationObj:any  = new BehaviorSubject({});
public isLocationChange:any = new BehaviorSubject(false);
public loginUserObj:any = new BehaviorSubject({});
public isManualLocation:any = new BehaviorSubject(false);
public isRedirectedformTractor:any = new BehaviorSubject(false)
invokeProductEnquiry = new EventEmitter(); 
subsVarProductEnquiry: Subscription; 
subsVarSelectCategory: Subscription; 
invokeSelectCategory = new EventEmitter(); 

onSelectCategoryClick(id:number) {   
  this.invokeSelectCategory.emit(id);    
} 
// onProductEnquiryClick(id:number,typeId:number, categoryId?:number, dealerId?:any) {  
//   this.invokeProductEnquiry.emit(id+'|'+typeId+'|'+categoryId+'|'+dealerId);    
// } 

onProductEnquiryClick(obj:{}) {  
   this.invokeProductEnquiry.emit(obj);    
} 



constructor(private http:HttpClient) {  }
  showHideLoader = false;
  HideLoader = true;
  excelHideLoader = true;
  billLoader = false;

  updateInArr(oldData, newData) {  
    let len = Number(oldData.length);
    if (!len) return newData;
    if (len) {
      Array.prototype.push.apply(oldData, newData);    
        newData = oldData.splice(len)       
    }
    return newData;
  }


getAddress(selectedID, addressType):Observable<any>{
   return  this.http.get<any>(API_PATH.getUserAddressAPI+`${selectedID}&type=${addressType}`);
}

saveProfileDetails(Obj:any){
  const body = {
    "apiKey": "123",
    "FarmerId": Obj["farmerId"],
    "userid": Obj["farmerId"],
    "Email": Obj["email"],
    "RefSource": "",
    "Fname": Obj["firstName"],
    "Lname":  Obj["lastName"],
    "FatherName": "",
    "Mobile":  Obj["mobile"],   
    "StateId":  Obj["stateId"],    
    "DistrictId":  Obj["districtId"],  
    "BlockId":  Obj["blockId"],    
    "VillageId": Obj["villageId"],    
    "NearByVillage": Obj["nearbyVillage"],   
    "Address":  Obj["address"],   
    "Landmark": "",    
    "PinCode": "",    
  } 
  return this.http.post(API_PATH.updateProifleDetails, body);  
}


getExistingFarmerDetails(farmerId):Observable<any>{
  return this.http.get<any>(API_PATH.getExistingFarmerDetails+farmerId)
}

getOrderHistory(farmerId):Observable<any>{
  return this.http.get<any>(API_PATH.getOrderHistory+farmerId)
}

getNotificationsHistory(buyerId):Observable<any>{
  return this.http.get(API_PATH.getNotificatins+buyerId)
}

  getLoaderState() {
    return this.HideLoader;
  }

  setLoaderState(value) {
    this.HideLoader = value;
  }
  getOrderStatus(recordId, orderId){
    let obj = {};
    obj["recordid"] = recordId
    obj["orderid"] = orderId
    return this.http.get(API_PATH.getOrderStatus, {params:obj})
  }

  cancelReturnOrder(typeId):Observable<any>{
     return this.http.get<any>(API_PATH.cancelReturn+typeId)
  }

  cancelReason(body:{}):Observable<any>{
      return this.http.post<any>(API_PATH.cancelReason, body)
  }
  
  ProductReviewAndRating(body:{}):Observable<any>{
    return this.http.post<any>(API_PATH.productReviewFeedback, body)
  }

  uploadFiles(imgbase,imgname):Observable<any>{   
    return this.http.post<any>(API_PATH.imageUplaoder+`?imgbase=${imgbase}&imgname=${imgname}`, {});
  }

getMenu():Observable<any>{
  return this.http.get<any>(API_PATH.getLeftMenu);
}


getNotification(obj:{}):Observable<any>{
  return this.http.get<any>(API_PATH.websiteNotificatiion, {params:obj});
}


}


