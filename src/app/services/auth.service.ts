import { Injectable } from '@angular/core';
import { API_PATH } from '../utilis/app.config';
import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";

function _window(): any {  
  return window;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  constructor(
    private http: HttpClient,
  ) { }

  get nativeWindow(): any {
    return _window();
  }
 

   getOTP(farmerName,mobileNo){      
    return this.http.get(API_PATH.centraliseLogin + 'Name='+farmerName+ '&Number=' + mobileNo + '&FromSource=1&ToSource=0')
  }


  verfifyOTP(farmer,  mobileNo, otp){
    return this.http.get(API_PATH.centraliseVerifyLogin+ 'Name='+farmer+ '&Number=' + mobileNo + '&OTP=' + otp)
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  
  farmerAppLogin(phoneNo, referBy, farmerId, deviceId, farmerName){
    return this.http.get(API_PATH.farmerAppLogin + '?apiKey=123&PhoneNo=' + phoneNo + '&referedBy=' + referBy + '&FarmerId=' + farmerId + '&DeviceId=' + deviceId + '&Name=' + farmerName);
  }

  logout() {
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
  }
}
