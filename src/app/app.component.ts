import {Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { GlobalService } from './services/global.service';
import { CommonService } from './services/common.service';
import { MessagingService } from './services/messaging.service';
import { HomeService } from './services/home.service';
declare let $: any;
declare let gtag: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    Location, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }
  ]
})
export class AppComponent  implements OnInit {
  location: any;
  routerSubscription: any;
  isTokenfired: boolean = true;
  thirdPartyClientInfo: any;
  isclientInfo:boolean=false;
  constructor(
    private router: Router,
    private globalService: GlobalService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private messagingService: MessagingService,
    private homeService:HomeService
  ) {     
    this.getThirdPartyDtl();
    this.getStateList();
    // this.gTagMethods();
    this.router.events.subscribe(event=>{
      if (event instanceof NavigationEnd) {
        this.getThirdPartyDtl();
      }
    })
   
  }

  ngOnInit() {
    this.commonService.isAskedforlocation = Boolean(sessionStorage.getItem('isAsklocation'))  
    this.navigateToTop(); 
    this.setlocation();  
    this.checkIfLogin();

    
 }



districtList:any=[]
 getThirdPartyDtl(){
   this.route.queryParamMap.subscribe((res: any) => {
     if (res?.params.PartnershipID) {
       this.isclientInfo = true;
       this.thirdPartyClientInfo = res?.params;
       localStorage.setItem('state', res?.params.state);
       localStorage.setItem('district', res?.params.district);
       localStorage.setItem('stateId', res?.params.stateId);       
       let state = res?.params.state;
       let district = res?.params.district;
       if (this.stateList.length){
         let stateId = this.stateList.filter(d => d.Name.toLowerCase() == state.toLowerCase())[0].Id;
         if(stateId){
           this.homeService.getDistrictList(stateId).subscribe((data: any) => {
             this.districtList = data.List;
             let districtId = this.districtList
               .filter(d => d.Name.toLowerCase() == district.toLowerCase())[0].Id;
             console.log(districtId);
             let obj = {};
             obj["state"] = state;
             obj["district"] = district;
             obj["stateId"] = stateId;
             obj["districtId"] = districtId;
             localStorage.setItem('districtId', districtId);
             this.globalService.defaultLocationObj.next(obj);
             sessionStorage.setItem('thirdPartyClient', JSON.stringify(res?.params))
             this.commonService.trackThirdPartyClientInfo.next(res?.params);
           }, err => console.log(err))
         }     
       }       
     } else {
       this.isclientInfo = false;            
      //  this.messagingService.requestPermission();
      //  this.messagingService.receiveMessage(); 
     }
   })
 }

  stateList:any=[];
getStateList(){
  this.homeService.getStateList().subscribe((res: any) => {
    this.stateList = res.List;
  }, err => console.log(err))
}




  /**GET LOCATION IF AVAILABLE IN STORAGE**/
  setlocation() {
    const clientIfo = JSON.parse(sessionStorage.getItem('thirdPartyClient'));     
    if (!this.isclientInfo &&  clientIfo && Object.keys(clientIfo).length) {   
      let obj = {};
      obj["state"] = clientIfo.state;
      obj["district"] = clientIfo.district;
      obj["stateId"] = clientIfo.district;
      obj["districtId"] = clientIfo.district;
      this.globalService.defaultLocationObj.next(obj);            
    }
    const st = localStorage.getItem('state');
    const dist = localStorage.getItem('district');
    const stateId = localStorage.getItem('stateId');
    const distId = localStorage.getItem('districtId');
    const isManualLocation = localStorage.getItem('isManualLocation');
    if ((st != null) || (dist != null)) {
      this.globalService.defaultLocationObj.next({ state: st, district: dist, stateId: stateId, districtId: distId });
      this.commonService.sendManualLocationMessage({ state: st, district: dist });
      this.commonService.sendLocationMessage({ state: st, district: dist });
    }
  }

  /**NAVIGATE TO EVERY NEW PAGE TO TOP VIEW**/
  navigateToTop() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        document.body.scrollTop = 0;
      }
    });
  }

  /**CHECK IF USER LOGGED IN**/
  checkIfLogin() {
    let logiStatus = localStorage.getItem('loginStatus') == "true" ? true : false
    let obj = {};
    obj["FarmerID"] = localStorage.getItem('FarmerId');
    obj["username"] = localStorage.getItem('FarmerName');
    obj["loginStatus"] = logiStatus;
    if (logiStatus) {
      this.globalService.loginUserObj.next(obj);
    }
  }

  /**HEADER SHOW/HIDE FUNCTIONALITY BASED ON GTAG**/
  visibility: boolean = true;
  gTagMethods() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-117595978-1',
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
    });
    this.globalService.filterObj.subscribe(res => {
      if (res["IsBodayOnlyShow"] != undefined && res["IsBodayOnlyShow"] != null && res["IsBodayOnlyShow"] == true) {
        this.visibility = false;
      }
    });

    this.route.params.subscribe(res => {
      this.visibility = (res["sourceId"] != undefined && res["sourceId"] != null) ? false : true;
    });
  }



  message: any = ""
  saveTokenPushNotification() {
    sessionStorage.setItem('tokenfired', 'yes');
    // this.messagingService.requestPermission();
    // this.messagingService.receiveMessage();
    // this.message = this.messagingService.currentMessage;
  }






}
