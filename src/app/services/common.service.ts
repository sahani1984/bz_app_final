import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private subject = new Subject<any>();
  private latLong = new Subject<any>();
  private manualLocation = new Subject<any>();
  private login = new Subject<any>();
  private districtId = new Subject<any>();
  private seeMore = new Subject<any>();
  public trackThirdPartyClientInfo = new Subject<any>()
  public isProfileCopleted = new BehaviorSubject<any>(false);
  public isAskedforlocation:boolean;
  constructor() { }

  sendLocationMessage(message: any) {
    this.subject.next(message);
  }

  getLocationMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  sendLatLongMessage(message: any) {
    this.latLong.next(message);
  }

  getLatLongMessage(): Observable<any> {
    return this.latLong.asObservable();
  }

  sendManualLocationMessage(message: any) {
    this.manualLocation.next(message);
  }

  getManualLocationMessage(): Observable<any> {
    return this.manualLocation.asObservable();
  }

  sendLoginMessage(message: any) {
    this.login.next(message);
  }

  getLoginMessage(): Observable<any> {
    return this.login.asObservable();
  }

  sendDistrictMessage(message: any) {
    this.districtId.next(message);
  }

  getDistrictMessage(): Observable<any> {
    return this.districtId.asObservable();
  }

  sendSeeMoreMessage(message: any) {
    this.seeMore.next(message);
  }

  getSeeMoreMessage(): Observable<any> {
    return this.seeMore.asObservable();
  }

  

}
