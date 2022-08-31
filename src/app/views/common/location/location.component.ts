import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { HomeService } from 'src/app/services/home.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  locationForm:FormGroup;
  stateList: any = [];
  districtList: any = [];
  stateName: any=''
  districtName: any=''
  stateId: any
  districtId: any

  constructor(
    private commonService:CommonService,
    private globalService:GlobalService,
    private categoryService:CategoryService,
    private homeService:HomeService,
    private router:Router,
    private fb:FormBuilder,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.initform();
    this.getStateListData();
  }

  addState(stateId: any) {
    console.log(stateId);
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

  changeLocation() {
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
    this.router.navigate(['/'])
    this.dialog.closeAll();
  }

  getStateListData() {
    this.homeService.getStateList().subscribe((res: any) => {
      this.stateList = res.List;
    }, err => console.log(err))
  }

  getFarmersAppservices() {
    if (this.districtName && this.stateName) {
      console.log("location popup fired")
      this.categoryService.getFarmerAppServices(this.districtName, this.stateName).subscribe((res: any) => {
        if (res.Status) {
          localStorage.setItem('haryanaDistrictId', res.Location[0].DistrictId);
          this.commonService.sendDistrictMessage({ stateId: res.Location[0].StateId, districtId: res.Location[0].DistrictId });
        }
      },
        err => console.log(err))
    }
  }

  initform() {
    this.locationForm = this.fb.group({
      state: ['', Validators.required],
      district: ['', Validators.required]
    })
  }

}
