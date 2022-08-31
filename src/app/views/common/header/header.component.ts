import { Component, OnInit,PipeTransform, Pipe, HostListener, NgZone, DoCheck } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from 'src/app/services/home.service';
import { MapsAPILoader } from '@agm/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { LoginComponent } from '../../login/login.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { map, startWith, takeLast, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';


declare var $: any;
export class State {
  constructor(public name: string, public population: string, public flag: string) { }
}
declare const annyang: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  topSearch:boolean=true;
  isMobileMenu = new BehaviorSubject(false);
  searchPlaceholder:string='Search in Behtarzindagi.in';
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      this.topSearch=event.target.innerWidth>=980?true:false;
    }
  stateCtrl: FormControl;
  selectedCategoryId:any=0;

  myControl = new FormControl();
  options: Array<{ id: string; name: string }> = [];
  filteredOptions: Observable<string[]>;


  filteredData:any=[];
  filteredStates: Observable<any[]>;
  toHighlight: string = '';
  moveToHome(){
    this.selectedCategoryId=0;
    this.searchPlaceholder='Search in Behtarzindagi.in';
    this.myControl.reset();
  }
  displayFn(user: any) {
    if (user) { return user.name; }
  }
  
  locationForm: FormGroup;
  loginWrapperBox: boolean = true;
  stateList: any = [];
  districtList: any = [];
  stateName: any
  districtName: any
  closeIcon: boolean = false;
  farmerCategoryList: any = [];
  loginStatus: boolean = false;
  latitude: any;
  longitude: any;
  zoom: number;
  address: string;
  private geoCoder: any;
  categoryWrapper: boolean = false;
  categoryWrapperMobile: boolean = false;
  bannersList: any = [];
  accountSubMenu: boolean = false;
  resendOtp: boolean = false;
  farmerName: any
  farmerIds:any=0
  stateId: any
  districtId: any
 




clientLogo:any="";
thirdpartyIds:any;
isThirdParty:boolean=false
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private categoryService: CategoryService,
    private homeService: HomeService,
    private mapsAPILoader: MapsAPILoader,
    public router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private dialog: MatDialog,
    private toastr:ToastrService) {  
    this.isMobileMenu.subscribe((res: boolean) => this.categoryWrapperMobile = res);  
    this.commonService.trackThirdPartyClientInfo.subscribe(res=> {
      console.log(res.PartnershipID);
      if(res) {
        this.thirdpartyIds = res.PartnershipID
        console.log(res);
        this.clientLogo = res?.logo;
        this.isThirdParty = true;
      }
    })
    const clientIfo = JSON.parse(sessionStorage.getItem('thirdPartyClient'));     
    if (clientIfo && clientIfo?.logo) this.clientLogo = clientIfo?.logo;
      this.leadFunctionality()
     /****/
     this.globalService.defaultLocationObj.subscribe(res=>{
       if(res){
        //  console.log(res);
         this.stateName = res["state"];
         this.districtName = res["district"];
         this.stateId = res["stateId"];
         this.districtId = res["discrictId"];
       }
     })

   /**TO DETECT LOGIN AND GET DETAILS**/
    this.globalService.loginUserObj.subscribe((res: any) => {     
      if (Object.keys(res).length) {
        this.farmerName = res.username;
        this.loginStatus = res.loginStatus;  
        this.farmerIds = res["FarmerID"] ? res["FarmerID"]:0
        this.websiteNotification();
      }  
    })
   this.categoryService.categoryList.subscribe((res: any) => this.farmerCategoryList = res);
   this.router.events.subscribe(res => {
      if (res) this.categoryWrapperMobile = false;
    })
}


  isAsklocation:boolean=false;
  count:number=0
  ngOnInit(): void {       
    this.route.queryParams.subscribe(res=>{       
      this.count++      
      if (this.count == 2){       
      if (res["IsLocationAsk"]?.trim() == '1' || ((this.commonService.isAskedforlocation == undefined) && (res["IsLocationAsk"]?.trim() != undefined))) {
          sessionStorage.setItem('isAsklocation', 'true');
          this.isAsklocation = true;
          this.commonService.isAskedforlocation = true;
        console.log(this.commonService.isAskedforlocation)
        } else{
        this.commonService.isAskedforlocation = false;
        this.isAsklocation = false;
        sessionStorage.setItem('isAsklocation', 'false');  
        console.log(this.commonService.isAskedforlocation) 
        } 
      }

    if (this.commonService.isAskedforlocation) {
        console.log('location fire')
        this.mapsAPILoader.load().then(() => {
          this.setCurrentLocation();
          this.geoCoder = new google.maps.Geocoder;
          this.getFarmersAppservices();
        });
      }   
   })

   this.router.events.pipe(filter(event=> event instanceof NavigationEnd))
   .subscribe(res=>{   
       if (this.commonService.isAskedforlocation) {        
        this.mapsAPILoader.load().then(() => {
           this.setCurrentLocation();
           this.geoCoder = new google.maps.Geocoder;
           this.getFarmersAppservices();
         });        
     }
   })

    const state = localStorage.getItem('state');
    const district = localStorage.getItem('district');
    if (state && district) {
      this.stateName = state;
      this.districtName = district;
      this.commonService.sendManualLocationMessage({ state: this.stateName, district: this.districtName });
      this.commonService.sendLocationMessage({ state: this.stateName, district: this.districtName });   
    } else {
      this.getLocation();
    }



    this.createAddUserForm();
    this.getStateListData();

    this.commonService.getLocationMessage().subscribe((res: any) => {
      if (res) {
        this.districtName = res.district;
        this.stateName = res.state;
      }
    });

    this.enquiryMethod();
    this.farmerCategory();
    this.topSearch = window.innerWidth >= 980 ? true : false;
    this.getAccountMenu();
    this.websiteNotification();
  }

  ngDoCheck(){
   
  }

  /**WEBSITE NOTIFICATION**/
  
  showNotificaton:boolean= false;
  notificationArr:any = [];
  notificationCount:any=0;
  websiteNotification() {
    let userId = localStorage.getItem('FarmerId')
    let obj = {}
    obj["sourceType"] = "farmer";
    obj["userTypeId"] = 1;
    obj["userId"] = userId ? userId : this.farmerIds;
    this.globalService.getNotification(obj).subscribe(
      (res) => {
        if(res["Status"]){
          this.notificationArr = res["Notification"].Table
          this.notificationCount = res["Notification"].Table1[0].NotificatioCount
        }       
      },
      (err) => console.log(err)
    )
  }



 agentDtls: any;
  searchText: string = '';
  leadFunctionality() {
    this.route.queryParams.subscribe(params => {
      if (params['lead'] != undefined && params['lead'] != "") {
        sessionStorage.setItem("SourceName", "SBI");
      }
      else if (params['ls'] != undefined && params['ls'] != "") {
        sessionStorage.setItem("SourceName", params['ls']);
      }
    });
    this.agentDtls = window.navigator.userAgent;
    localStorage.setItem("userAgentId", this.agentDtls);

    this.searchText = 'hi';
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  } 


  isLoading = false;
  getTitle(bookId: any) {    
    let searchId=bookId!=undefined? bookId["id"]:'';
    if(searchId!='' && searchId!=undefined){
      this.router.navigate(['/bz/search', searchId], {queryParams:{id:bookId["id"],name:bookId["name"],category:this.selectedCategoryId}})
    }
    return bookId!=undefined?(bookId===typeof(String)?'':bookId["name"]) :'';
  }



  private _filter(value: any): any {
    let vFarmerId:number=0;
    let vStateName:string='';
    let vDistrictName:string='';
    if(localStorage.getItem["FarmerId"]!=undefined){
      vFarmerId=Number(localStorage.getItem["FarmerId"]);
    }
    if(this.stateName!="" && this.stateName!=undefined){
      vStateName=this.stateName;
    }
    if(this.districtName!="" && this.districtName!=undefined){
      vDistrictName=this.districtName;
    }
    if(value!=undefined && value!=''){
      let filterValue = '';
      if (typeof value === 'string'){
        filterValue = value.toLowerCase();
       }
       else{
        filterValue=value["name"].toLowerCase();
       }      
    this.toHighlight = filterValue;
    localStorage.setItem("SID",vStateName);
    localStorage.setItem("DID",vDistrictName);
   this.categoryService.productSearch({"farmerId":vFarmerId,"categoryId":this.selectedCategoryId,"stateName":vStateName,"districtName":vDistrictName,"searchText":filterValue}).subscribe((res: any) => {
      if (res) {
        this.options=res.BZApiResponse;             
      }
    });
  }
    return this.options;
  }


  clickedOutside(event) {
    if ((event.target.className == 'aside-toggler') || (event.target.className == 'menu_strip')) {
      return;
    } else {
      this.categoryWrapperMobile = false;
    }
  }



  leftMenuList: any = [];
  getAccountMenu() {
    this.globalService.getMenu().subscribe(
      (res) => {
        if (res["Status"]) {
          this.leftMenuList = res["LeftMenu"].Menu        
        }
      }
    )
  }

  createAddUserForm() {
    this.locationForm = this.fb.group({
      state: ['', Validators.required],
      district: ['', Validators.required]
    })
  }

  getStateListData() {
    this.homeService.getStateList().subscribe((res: any) => {
      this.stateList = res.List;
    }, err => console.log(err))
  }

  category() {
    this.categoryWrapper = !this.categoryWrapper;
  }

  addState(stateId: any) {
    let result = stateId.substr(0, stateId.indexOf(' '));
    this.stateName = stateId.substr(stateId.indexOf(' ') + 1);
    this.stateId = stateId.substr(0, stateId.indexOf(' '));   
    this.homeService.getDistrictList(result).subscribe((res: any) => {      
      this.districtList = res.List;      
    }, err => console.log(err))
  }

  addDistrict(districtId) {
    this.districtName = districtId.substr(districtId.indexOf(' ') + 1);
    this.districtId = districtId.substr(0, districtId.indexOf(' '));
  }

  waitForOneSecond(data) {
    return new Promise(resolve => {
      resolve(data)
    });
  }

  farmerCategory() {
    if (this.globalService.subsVarSelectCategory == undefined) {
      this.globalService.subsVarSelectCategory = this.globalService.
        invokeSelectCategory.subscribe((id) => {
          this.selectedCategoryId = Number(id);
          if (this.selectedCategoryId > 0 && this.farmerCategoryList.length > 0) {
            let vCategoryName = this.farmerCategoryList.find(p => p.CategoryId == this.selectedCategoryId).Categoryname;           
            this.searchPlaceholder = 'Search in ' + vCategoryName;
          }
          else {
            this.searchPlaceholder = 'Search in Behtarzindagi.in';
          }
        });
    }
  }

  getLocation() {
    if (!this.isAsklocation) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else {
      //console.log("Geolocation is not supported by this browser.");
    }
    //console.log('step-4',new Date().toLocaleString(undefined, { hour12: false }));
  }

  showPosition(position) {
    localStorage.setItem('lat', position.coords.latitude)
    localStorage.setItem('long', position.coords.longitude)      
  }

  showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        $('#myModal').modal({
          backdrop: 'static',
          keyboard: false
        });
        localStorage.setItem('isBlockLocation', 'true');
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break;
    }
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;      
        /*added by prashant */
        localStorage.setItem('latData',this.latitude);
        localStorage.setItem('longData',this.longitude);
        /*end added by prashant */
        this.zoom = 8;
        this.commonService.sendLatLongMessage({ lat: this.latitude, long: this.longitude })
        this.getAddress(this.latitude, this.longitude);
        this.getFarmersAppservices();
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        let city, region, country;
        if (results[1]) {
          var indice = 0;
          for (var j = 0; j < results.length; j++) {
            if (results[j].types[0] == 'locality') {
              indice = j;
              break;
            }
          }
          for (var i = 0; i < results[j].address_components.length; i++) {
            if (results[j].address_components[i].types[0] == "locality") {
              //this is the object you are looking for City
              city = results[j].address_components[i];
            }
            if (results[j].address_components[i].types[0] == "administrative_area_level_1") {
              //this is the object you are looking for State
              region = results[j].address_components[i];
            }
            if (results[j].address_components[i].types[0] == "country") {
              //this is the object you are looking for
              country = results[j].address_components[i];
            }
          }
          //city data         
          if (this.stateName && this.districtName) {
            this.commonService.sendLocationMessage({ state: this.stateName, district: this.districtName });
          } else {
            this.districtName = city.long_name;
            this.stateName = region.long_name;
            this.commonService.sendLocationMessage({ state: this.stateName, district: this.districtName });
            this.globalService.defaultLocationObj.next({ state: this.stateName, district: this.districtName });
          }
          this.getFarmersAppservices();
        } else {
          console.log("No results found");
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  goBack() {
    this.loginWrapperBox = true;
  }

  locationModal() {  
    const clientIfo = JSON.parse(sessionStorage.getItem('thirdPartyClient')); 
    if (clientIfo?.PartnershipID) return;
    $('#myModal').modal({
      backdrop: 'static',
      keyboard: false
    });
    this.closeIcon = true;
    this.getFarmersAppservices();
  }

 loginWrapper(callingFrom: string, id: number, typeId: number, location: string, categoryId: number, dealerId: any) {
    if (location == '' && this.stateName != undefined && this.stateName != '') {
      location = this.stateName + '|' + this.districtName;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      "callingFrom": callingFrom,
      "id": id,
      "typeId": typeId,
      "location": location,
      "categoryId": categoryId,
      "dealerId": dealerId
    };   
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  getFarmersAppservices() {
    if (this.districtName && this.stateName) {     
      this.categoryService.getFarmerAppServices(this.districtName, this.stateName).subscribe((res: any) => {
        if (res.Status) {
          localStorage.setItem('haryanaDistrictId', res.Location[0].DistrictId);
          this.commonService.sendDistrictMessage({ stateId: res.Location[0].StateId, districtId: res.Location[0].DistrictId });
        }
      },
        err => console.log(err))
    }
  }

  keyPressEvent(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {   
    this.commonService.sendManualLocationMessage({ state: this.stateName, district: this.districtName });
    this.commonService.sendDistrictMessage({ stateId: this.stateId, districtId: this.districtId });
    this.commonService.sendLocationMessage({ state: this.stateName, district: this.districtName });
    localStorage.setItem('district', this.districtName);
    localStorage.setItem('districtId', this.districtId);
    localStorage.setItem('state', this.stateName);
    localStorage.setItem('isManualLocation', 'true')
    this.globalService.defaultLocationObj.next({ state: this.stateName, district: this.districtName, stateId: this.stateId, districtId: this.districtId })
    this.globalService.isLocationChange.next(true);
    this.getFarmersAppservices();    
    $('#myModal').modal('hide');   
    this.router.navigate(['/'])
  }

 

  signOut() {
    localStorage.removeItem('district');
    localStorage.removeItem('FarmerId');
    localStorage.removeItem('haryanaDistrictId');
    localStorage.removeItem('farmerMob');
    localStorage.removeItem('stateId');
    localStorage.removeItem('state');
    localStorage.removeItem('FarmerName');
    localStorage.removeItem('lat');
    localStorage.removeItem('long');
    localStorage.removeItem('isManualLocation');
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('BlockName');
    localStorage.removeItem('DistrictName');
    localStorage.removeItem('NearByVillage');
    localStorage.removeItem('VillageName');
    localStorage.removeItem('farmer_dtl');
    let loginObj = {};
    loginObj["username"] = null
    loginObj["loginStatus"] = false;
    loginObj["FarmerID"] = null;
    this.farmerIds = 0;
    this.globalService.loginUserObj.next(loginObj);
    this.commonService.sendLoginMessage({ isLogin: false, farmerId: null, farmerName: null, farmerMob: null })
    this.loginStatus = false;
    this.loginWrapperBox = true;
    localStorage.removeItem('user_dtl');
  }


  goToSubcategory(item) {
    localStorage.setItem('kgpStatus', item.isKGP_Category);
    this.router.navigate(['/bz/category', item.CategoryId], { queryParams: { category: item.Categoryname } });
    this.categoryWrapper = false;
    this.categoryWrapperMobile = false;
  }

  navigateToProfile() {
    this.router.navigate(['/bz/profile']);
  }

  categoryMobile(event) {   
    event.preventDefault();
    setTimeout(()=>{
      if (this.categoryWrapperMobile) this.isMobileMenu.next(false);
      else this.isMobileMenu.next(true);
    },0)
  }

  hideMobileWrapper(event){   
    let el = document.querySelector('.aside-toggler');
    let searchbox = document.querySelector('.searchInput')
    if ((el !== event.target || !el.contains(event.target)) && event.target !== searchbox ) { 
      event.preventDefault();
      this.isMobileMenu.next(false);
       }     
     
  }
  gotoHomePage() {
    this.router.navigate(['/']);
    this.categoryWrapperMobile = false;
  }

  enquiryMethod() {
    if (this.globalService.subsVarProductEnquiry == undefined) {
      this.globalService.subsVarProductEnquiry = this.globalService.
        invokeProductEnquiry.subscribe((res) => {
          if (localStorage.getItem("FarmerId") === null) {           
            this.loginWrapper((Number(res["typeId"]) == 500 ? 'Chatbot' : 'Enquiry'), res["id"], res["typeId"], this.stateName + '|' + this.districtName, res["categoyId"], res["dealerId"] ? res["dealerId"] : 0);
          } else {
            if (Number(res["typeId"]) == 500) {
              window.open("https://wa.link/vv99tv", "_blank");
            } else {
              let vLeadSource: string = '';
              if (sessionStorage.getItem("SourceName") != null && sessionStorage.getItem("SourceName") != undefined) {
                vLeadSource = sessionStorage.getItem("SourceName");
              }
              let user = JSON.parse(localStorage.getItem('user_dtl'));
              let obj = {};
              obj["Name"] = user["full_name"];
              obj["Number"] = user["mob"];
              obj["Location"] = this.stateName + '|' + this.districtName;
              obj["FarmerId"] = Number(localStorage.getItem("FarmerId"));
              obj["DistrictId"] = localStorage.getItem("districtId") == null ? 0 : Number(localStorage.getItem("districtId"));
              obj["ProductId"] = Number(res["id"]);
              obj["Typeid"] = Number(res["typeId"]);
              obj["DealerId"] = res["dealerId"] ? res["dealerId"] : 0;
              obj["CategoryId"] = res["categoyId"];
              obj["FromSource"] = 1;
              obj["ToSource"] = 0;              
              this.categoryService.sendEnquiry(obj).subscribe(
                (res: any) => {                  
                  if (res.Status) {
                    this.toastr.success('Your enquiry has been sent successfully', 'Success!!');
                  }
                },
                (err) => console.log(err)
              )
            }
          }
        });
    }
  }

  /**NAVIGATE TO TRACTOR WEBSITE**/
  goToTractor() {
    this.router.navigate(["/"]).then(result => { window.location.href = 'https://behtarzindagi.in/tractor/' });
  }

  navigate(urls) {
    window.open(urls, '_blank')
  }


}

@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: any, search): string {   
    const pattern = search
      .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      .split(' ')
      .filter(t => t.length > 0)
      .join('|');
    const regex = new RegExp(pattern, 'gi');

    return search ? text.toString().replace(regex, match => `<b>${match}</b>`) : text;
  }
}
