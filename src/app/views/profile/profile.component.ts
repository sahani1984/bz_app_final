import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/services/auth.service';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent   implements OnInit {
  profile_form: FormGroup
  proImgUrl: any = ''
  pageTitle: any = ''
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective
  constructor(
    private globalService: GlobalService,
    private commonService: CommonService,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router, private metaService:MetaService) {

    this.commonService.getLoginMessage().subscribe(res => {
      if (res["farmerId"] == null) this.router.navigate(['/']);
    })
    this.route.queryParams.subscribe(res => {
      if (Object.keys(res).length) this.pageTitle = res["info"]
    })
  }
  ngOnInit(): void {
    this.metaService.updateMeta('/bz/profile', null);
    this.checkIfLogin();
    this.initializeform();
    this.getStateList();
    this.formerDetailsIfRegistered();
  }

  saveProfile(data) {
    let obj = {};
    obj["firstName"] = data["firstName"];
    obj["lastName"] = data["lastName"];
    obj["email"] = data["email"];
    obj["mobile"] = data["mobile"];
    obj["stateId"] = data["state"];
    obj["districtId"] = data["district"];
    obj["blockId"] = data["subDistrict"];
    obj["villageId"] = data["village"];
    obj["nearbyVillage"] = data["neighbour_village"];
    obj["PinCode"] = data["Pincode"];
    obj["address"] = data["address"];
    obj["farmerId"] = localStorage.getItem("FarmerId");
    console.log(obj)
    this.globalService.saveProfileDetails(obj).subscribe(
      res => {
        if (res["Success"]) {
          this.toastr.success(res["Msg"], 'Success!');
          this.formGroupDirective.resetForm();
          this.router.navigate(['/']);
        } else {
          this.toastr.error('Something went wrong', 'Error!');
        }
      },
      err => console.log(err)
    )
  }

  /**GET DISTRICT LIST**/
  stateList: any = [];
  getStateList() {
    this.globalService.getAddress(0, 'S').subscribe(
      res => {
        if (res) {
          this.stateList = res["List"];
        }
      },
      err => console.log(err)
    )
  }


  /**GET DISTRICT LIST**/
  districtList: any = [];
  getDistrictList(stateID) {
    this.globalService.getAddress(stateID, 'D').subscribe(
      res => {
        if (res) {
          this.districtList = res["List"];
          this.districtList = this.districtList.sort(this.sortByName);
        }
      },
      err => console.log(err)
    )
  }

  /**GET SUB DISTRICT OR BLOCK LIST**/
  blockList: any = [];
  getBlockList(districtID) {
    this.globalService.getAddress(districtID, 'B').subscribe(
      res => {
        if (res) {
          this.blockList = res["List"];
          this.blockList = this.blockList.sort(this.sortByName);
        }
      },
      err => console.log(err)
    )
  }

  /**GET VILLAGE LIST**/
  villageList: any = [];
  getVillageList(blockID) {
    this.globalService.getAddress(blockID, 'V').subscribe(
      res => {
        if (res) {
          this.villageList = res["List"];
          this.villageList = this.villageList.sort(this.sortByName);
        }
      },
      err => console.log(err)
    )
  }


  checkIfLogin() {
    let farmerId = localStorage.getItem('FarmerId');
    if (!farmerId) {
      this.router.navigate(['/']);
    }
  }

  formerDetails: any = [];
  formerDetailsIfRegistered() {
    let farmerID = localStorage.getItem('FarmerId');
    this.globalService.getExistingFarmerDetails(farmerID).subscribe(
      res => {
        if (res["Status"]) {
          this.formerDetails = res["BZAppFarmerAddress"];
          this.getDistrictList(this.formerDetails.StateID);
          this.getBlockList(this.formerDetails.DistrictID);
          this.getVillageList(this.formerDetails.BlockID);
          this.profile_form.patchValue({
            firstName: this.formerDetails.FarmerFName,
            lastName: this.formerDetails.FarmerLName,
            email: this.formerDetails.Email,
            mobile: this.formerDetails.MobNo,
            state: this.formerDetails.StateID,
            district: this.formerDetails.DistrictID,
            subDistrict: this.formerDetails.BlockID,
            village: this.formerDetails.VillageID,
            neighbour_village: this.formerDetails.NearByVillage,
            address: this.formerDetails.Address
          })
        }
      },
      err => console.log(err)
    )
  }


  initializeform() {
    this.profile_form = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+')]),
      lastName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+')]),
      email: new FormControl(''),
      mobile: new FormControl('', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]),
      state: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      subDistrict: new FormControl('', [Validators.required]),
      village: new FormControl('', [Validators.required]),
      neighbour_village: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    })
  }

  isValidate(controls) {
    return this.profile_form.get(controls).touched && this.profile_form.get(controls).invalid
  }
  f(ctrl, err) {
    return this.profile_form.get(ctrl).hasError(err);
  }

  keyPressEvent(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  /**SORT ADDRESS API LIST BY NAME**/
  sortByName(a, b) {
    if (a.Name < b.Name) {
      return -1;
    } else if (a.Name > b.Name) {
      return 1
    }
    return 0;
  }

  checkIfValid(status){
    this.commonService.isProfileCopleted.next(status);
  }


}
