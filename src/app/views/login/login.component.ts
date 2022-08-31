import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ToastrService } from 'ngx-toastr';

import { takeUntil } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent   implements OnInit {
  loginForm: FormGroup;
  verifyOtpForm: FormGroup;
  loginWrapperBox: boolean = true;
  loginStatus: boolean = true;
  resendOtp: boolean = false;
  showHint: boolean = false;
  mobileNo: any;
  farmerName: any;
  callingFrom: string;
  id: number;
  typeId: number;
  location: string;
  CategoryId: any;
  DealerId: any;
  constructor(
    private authService: AuthService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {

    this.callingFrom = data.callingFrom;
    this.id = data.id;
    this.typeId = data.typeId;
    this.location = data.location;
    this.CategoryId = data.categoryId;
    this.DealerId = data.dealerId
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createVerifyForm();

    this.globalService.isRedirectedformTractor.subscribe(res => {
      if (res) {
        console.log('login event fired')
      }
    })

  }

  onLoginSubmit() {
   
    const farmerName = this.loginForm.get('full_name').value
    const mobileNo = this.loginForm.get('mob').value
    console.log('***')
    console.log(farmerName)
    console.log(mobileNo)
    this.authService.getOTP(farmerName, mobileNo).subscribe((res: any) => {
      console.log('sdjd')
      this.mobileNo = this.loginForm.get('mob').value;
      this.loginWrapperBox = false;
    }, err => console.log(err))
  }

  onVerifyOtp() {
    const farmerName = this.loginForm.get('full_name').value;
    const otp = this.verifyOtpForm.get('otp').value;
    console.log(farmerName, this.mobileNo, otp)
    this.authService.verfifyOTP(farmerName, this.mobileNo, otp).subscribe((res: any) => {
      if (res.Status) {
        this.loginStatus = false;
        this.farmerLogin(this.mobileNo, farmerName);
        this.verifyOtpForm.reset();
        /*Chatbot condition */
        if (localStorage.getItem("LoginType") != undefined && localStorage.getItem("LoginType") != "" && localStorage.getItem("LoginType") == "500") {
          localStorage.removeItem("LoginType");
          window.open("https://wa.link/vv99tv", "_blank");
        }
        let userData = res.ds.UserDetails[0];
        let swtData: {} = this.loginForm.value;
        swtData["UserTypeId"] = userData["UserTypeId"]
        swtData["loginStatus"] = userData["loginStatus"]
        localStorage.setItem('user_dtl', JSON.stringify(swtData));
      } else {
        alert('OTP is incorrect');
      }
    }, err => console.log(err, 'test step-0'))
  }


  resendOTP() {
    const farmerName = this.loginForm.get('full_name').value
    const mobileNo = this.loginForm.get('mob').value;
    console.log(farmerName, mobileNo);
    this.authService.getOTP(farmerName, mobileNo).subscribe((res: any) => {
      this.mobileNo = this.loginForm.get('mob').value;
      this.resendOtp = !this.resendOtp;
      this.loginWrapperBox = false;
      localStorage.setItem('loginMessage', res.message);
    }, err => {
      console.log(err);
    })
  }


  private farmerLogin(phoneNo, farmerName) {
    this.authService.farmerAppLogin(phoneNo, 0, 0, 0, farmerName).subscribe((res: any) => {
      console.log(res);
      if (res[0].Status) {
        let loginObj = {};
        loginObj["username"] = res[0].FirstName
        loginObj["loginStatus"] = true;
        loginObj["FarmerID"] = res[0].FarmerID;
        this.globalService.loginUserObj.next(loginObj);
        this.dialog.closeAll();
        //this.farmerName = res[0].FirstName;
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

        let obj = {}
        obj["StateName"] = res[0].StateName;
        obj["DistrictName"] = res[0].DistrictName;
        obj["DistrictId"] = res[0].DistrictId;
        obj["StateId"] = res[0].StateId;
        obj["FarmerID"] = res[0].FarmerID;
        obj["Address"] = res[0].Address;
        obj["FirstName"] = res[0].FirstName;
        obj["LastName"] = res[0].LastName;
        obj["MobileNumber"] = res[0].MobileNumber
        localStorage.setItem('farmer_dtl', JSON.stringify(obj));

        //console.log('test step-1',this.callingFrom);
        if (this.callingFrom == 'Enquiry') {
          //Save Enquiry and show Msg
          let vData = { "location": this.location, "pid": Number(this.id), "typeid": Number(this.typeId), "fid": Number(localStorage.getItem("FarmerId")), "did": localStorage.getItem("districtId") == null ? 0 : localStorage.getItem("districtId") };
          let user = this.loginForm.value;
          let obj = {};
          obj["Name"] = user["full_name"];
          obj["Number"] = user["mob"];
          obj["Location"] = this.location;
          obj["FarmerId"] = res[0].FarmerID;
          obj["DistrictId"] = localStorage.getItem("districtId") == null ? 0 : localStorage.getItem("districtId");
          obj["ProductId"] = Number(this.id);
          obj["Typeid"] = Number(this.typeId);
          obj["DealerId"] = this.DealerId;
          obj["CategoryId"] = this.CategoryId;
          obj["FromSource"] = 1;
          obj["ToSource"] = 0;
          console.log(obj);
          this.categoryService.sendEnquiry(obj).subscribe((res: any) => {
            if (res.Status) {
              this.toastr.success('Your enquiry has been sent successfully', 'Success!!');
            }
          }, err => console.log(err, 'test step2'))
        }
      }
    }, err => console.log(err, 'test step-3'))
  }

  goBack() {
    this.loginWrapperBox = true;
  }

  keyPressEvent(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      full_name: ['', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+')]],
      mob: ['', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]]
    })
  }

  createVerifyForm() {
    this.verifyOtpForm = this.fb.group({
      otp: ['', Validators.required]
    })
  }

}
