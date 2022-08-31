import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { CategoryService } from 'src/app/services/category.service';
import { CommonService } from 'src/app/services/common.service';
import { GlobalService } from 'src/app/services/global.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent   implements OnInit {
  districtName: any;
  stateName: any;
  userAgentDtls: any;
  path1 = './assets/img/1.png';
  playstore = './assets/img/google-playstore.png';

  constructor(
    public router: Router,
    private viewportScroller: ViewportScroller,
    private globalService: GlobalService,
    private categoryService: CategoryService,
    private commonService:CommonService,
    private authService: AuthService) {

    this.globalService.defaultLocationObj.subscribe(res => {
      this.stateName = res["state"];
      this.districtName = res["district"];
      this.getFarmerCategoryList();
    });
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.checkIfRedirectedTractor();
      }
    });
  }

  ngOnInit(): void {
    this.checkIfRedirectedTractor()
    this.userAgentDtls = localStorage.getItem("userAgentId");
  }

  /**NAVIAGE TO SUB-CATEGORY**/
  goToSubcategory(item) {
    localStorage.setItem('kgpStatus', item.isKGP_Category);
    this.router.navigate(['/bz/category', item.CategoryId], { queryParams: { category: item.Categoryname } });
  }


  /**GET FARMER CATEGORY**/
  farmerCategoryList: any = [];
  getFarmerCategoryList() {
    if (this.districtName && this.stateName) {
      this.categoryService.getFarmerCategoryList(this.districtName, this.stateName).subscribe((res: any) => {
        if (res.Status) {
          this.farmerCategoryList = res["Category"].Category;
        }
      }, err => console.log(err));
    }
  }

  /**NAVIGATE TO TRACTOR WEBSITE**/
  goToTractor() {
    this.router.navigate(["/"]).then(result => { window.location.href = 'https://behtarzindagi.in/tractor/' });
  }


  /**CHECK IF LOGIN WHEN WEBSITE SWITCHING FROM TRACTER**/
  isLogin: boolean;
  checkIfRedirectedTractor() {
    this.globalService.loginUserObj.subscribe(res => {
      this.isLogin = (res["loginStatus"]) ? (res["loginStatus"]) : false
    })
    let user = JSON.parse(localStorage.getItem('user_dtl'));
    if (!this.isLogin && user) {
      this.farmerLogin(user["mob"], user["full_name"]);
    }
  }
  /**ADMIN & DEALER LOGIN METHOD**/
  private farmerLogin(phoneNo, farmerName) {
    this.authService.farmerAppLogin(phoneNo, 0, 0, 0, farmerName).subscribe((res: any) => {
      console.log(res);
      if (res[0].Status) {
        let loginObj = {};
        loginObj["username"] = res[0].FirstName
        loginObj["loginStatus"] = true;
        loginObj["FarmerID"] = res[0].FarmerID;
        this.globalService.loginUserObj.next(loginObj);
        localStorage.setItem('FarmerId', res[0].FarmerID);
        localStorage.setItem('FarmerName', res[0].FirstName);
        localStorage.setItem('farmerAdd', res[0].Address);
        localStorage.setItem('BlockName', res[0].BlockName);
        localStorage.setItem('DistrictName', res[0].DistrictName);
        localStorage.setItem('NearByVillage', res[0].NearByVillage);
        localStorage.setItem('VillageName', res[0].VillageName);
        localStorage.setItem('Address', res[0].Address);
        localStorage.setItem('farmerMob', phoneNo);
        localStorage.setItem('loginStatus', 'true');

      }
    }, err => console.log(err, 'test step-3'))
  }


  scrollToTop(): void {      
    $('html, body').animate({
      scrollTop: 0
    }, 1000)  
  }

  navigate(event, urls, target) { 
    event.preventDefault();   
    window.open(urls, target)
  }
}
