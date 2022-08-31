import { Injectable } from '@angular/core';
import { API_PATH } from '../utilis/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  excecuteCompletePayment = new BehaviorSubject(null);
  constructor(private http: HttpClient ) { }

  checkout(bodyObj:{}){  
    const httpOptions = {
      headers: new HttpHeaders({
        "district": bodyObj["district"],
        "state": bodyObj["state"]
      })
    }
    // const body = {
    //   "apiKey": "123",
    //   "userid": bodyObj["userId"],
    //   "ModeOfPayment": bodyObj["paymentMode"],     
    //   "Product": [
    //       {
    //           "PackageId": bodyObj["packageID"],
    //           "Quantity": bodyObj["quantity"],
    //           "RecordId": bodyObj["recordID"],
    //           "COD": bodyObj["COD"],
    //           "advanceCOD": bodyObj["advanceCOD"],
    //           "onlinePrice": bodyObj["OnlinePrice"],         
    //       }
    //   ],
    //   "Farmer": {
    //       "FarmerId": bodyObj["farmerId"],
    //       "FarmerName": bodyObj["farmerName"],
    //       "FatherName": "",
    //       "Mobile": bodyObj["farmerMob"],
    //       "OtherVillageName": "",
    //       "Address": bodyObj["address"],
    //       "VillageId": '',
    //       "BlockId": '',
    //       "DistrictId": bodyObj["districtID"],
    //       "StateId": bodyObj["stateID"],
    //    },
    //   "advAmount": bodyObj["amount"],
    //   "amount": bodyObj["amount"]
    // } 

    const body = {
      "apiKey": "123",
      "userid": bodyObj["userId"],
      "ModeOfPayment": bodyObj["paymentMode"],    
      "LeadSource": bodyObj["LeadSource"],
      "OnlineAmount": bodyObj["OnlinePrice"],
      "Product": [
        {
          "PackageId": bodyObj["packageID"],
          "Quantity": bodyObj["quantity"],
          "RecordId": bodyObj["recordID"],
        }
      ],
      "Farmer": {
        "FarmerId": bodyObj["farmerId"],
        "FarmerName": bodyObj["farmerName"],
        "FatherName": "",
        "Mobile": bodyObj["farmerMob"],
        "OtherVillageName": "",
        "Address": bodyObj["address"],
        "VillageId": '',
        "BlockId": '',
        "DistrictId": bodyObj["districtID"],
        "StateId": bodyObj["stateID"],
      }
    }   
    console.log(body);
     return this.http.post(API_PATH.orderCreate, body, httpOptions);     
  }

  test(bodyObj: {}){
    const body = {
      "apiKey": "123",
      "userid": bodyObj["userId"],
      "ModeOfPayment": bodyObj["paymentMode"],
      "LeadSource": bodyObj["LeadSource"],
      "OnlineAmount": bodyObj["OnlinePrice"],
      "Product": [
        {
          "PackageId": bodyObj["packageID"],
          "Quantity": bodyObj["quantity"],
          "RecordId": bodyObj["recordID"],
        }
      ],
      "Farmer": {
        "FarmerId": bodyObj["farmerId"],
        "FarmerName": bodyObj["farmerName"],
        "FatherName": "",
        "Mobile": bodyObj["farmerMob"],
        "OtherVillageName": "",
        "Address": bodyObj["address"],
        "VillageId": '',
        "BlockId": '',
        "DistrictId": bodyObj["districtID"],
        "StateId": bodyObj["stateID"],
      }
    }  
    console.log(body)
  }


  validateCoupon(AgentId:number,PackageId:number,CouponCode:string,quantity:number,TxnValue:number){   
    return this.http.get(API_PATH.getValidateCoupon+'AgentId='+AgentId+'&PackageId='+PackageId+'&CouponCode='+CouponCode+'&quantity='+quantity+'&TxnValue='+TxnValue);
 }

  customerPayRequest(body:any):Observable<any>{
    return this.http.post<any>(API_PATH.customerPayRequest, body);
  }

  completePayRequest(body:any): Observable<any> {
    return this.http.post<any>(API_PATH.completePayRequest, body)
  }


  refundPayRequest(body:any): Observable<any> {
    return this.http.post<any>(API_PATH.refundPayRequest, body);
  }

  clientFarmerInfo(body:any):Observable<any>{
    return this.http.post<any>(API_PATH.clientFarmerInfo, body);
  }

  orderStatus(params: any): Observable<any>{
    let qparams = `apiKey=123&OrderId=${params.OrderId}&PaymentStatus=${params.PaymentStatus}`;
    return this.http.get<any>(API_PATH.orderStatus+qparams)
  }

 
}
