import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Key } from 'selenium-webdriver';
import { GlobalService } from 'src/app/services/global.service';
import { MetaService } from 'src/app/services/meta.service';
@Component({
  selector: 'app-registrationprocess',
  templateUrl: './registration-process.component.html',
  styleUrls: ['./registration-process.component.css']
})
export class RegistrationProcessComponent implements OnInit {
  isFieldDisplay:any={FirstName:true,
    LastName:true,
    UserName:true,
    Email:true,
    Mobile:false,
    Aadhar:false,
    DL:false,
    HomeAddressLandmark:false,
    OfficeAddressLandmark:false,
    HomeStateId:false,
    HomeDistrictId:false,
    OfficeStateId:false,
    FirmName:false,
    OwnerName:false,
    CPName:false,
    GSTIN:false,
    PostalCode:false,
    Address:false,
    WorkingStateId:false}
    isFieldRequired1:any
    isFieldRequired:any={FirstName:false,
      LastName:false,
      UserName:false,
      Email:false,
      Mobile:false,
      Aadhar:false,
      DL:false,
      HomeAddressLandmark:false,
      OfficeAddressLandmark:false,
      HomeStateId:false,
      HomeDistrictId:false,
      OfficeStateId:false,
      FirmName:false,
      OwnerName:false,
      CPName:false,
      GSTIN:false,
      PostalCode:false,
      Address:false,
      WorkingStateId:false}
  formValidationData:any=[{"Name":"FirstName","DisplayName":"First Name","IsRequired":true,"ErrorMsg":""},
  {"Name":"LastName","DisplayName":"LastName","IsRequired":true,"ErrorMsg":""},
  {"Name":"Email","DisplayName":"Email","IsRequired":true,"ErrorMsg":""},
  {"Name":"Mobile","DisplayName":"Mobile","IsRequired":true,"ErrorMsg":""},
  {"Name":"Aadhar","DisplayName":"Aadhar","IsRequired":true,"ErrorMsg":""},
  {"Name":"DL","DisplayName":"DL","IsRequired":true,"ErrorMsg":""}]
  registrationForm:FormGroup;
  submitted = false;
  stateList: any = [];
  districtList: any = [];
  constructor(private globalService: GlobalService, private fb: FormBuilder, private metaService:MetaService) {
    this.globalService.filterObj.next({ IsBodayOnlyShow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  onRegSubmit() {    
    this.metaService.updateMeta('/bz/registration-process', null);
    this.submitted = true;
    if (this.registrationForm.invalid) {
        return;
    }
  }
  changeState(e) {
    if(Number(e.split(':')[1])>0){
      // this.homeService.getTDistrictList(e.split(':')[1]).subscribe((res: any) => {
      //   this.districtList = res["CorrelatedTypeMaster"];
      // }, err => console.log(err))
    }
  }
  createRegistrationForm(){
    this.registrationForm = this.fb.group({
      SourceId:[0,Validators.required],
      RoleId:[0,Validators.required],
      FirstName:['', [Validators.pattern('^[A-Za-z \u0900-\u097F]+'),Validators.minLength(3), Validators.maxLength(99)]],
      LastName:['', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+'),Validators.minLength(3), Validators.maxLength(99)]],
      UserName:['', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+'),Validators.minLength(3), Validators.maxLength(99)]],
      Email : ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      Mobile  : ['', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]],
      Aadhar:[null,Validators.required],
      DL:[null,Validators.required],
      HomeAddressLandmark:[null,Validators.required],
      OfficeAddressLandmark:[null,Validators.required],
      HomeStateId  : [null, Validators.required],
      HomeDistrictId  : [null, Validators.required],
      ReportingUserId:[null,Validators.required],
      OfficeStateId  : [null, Validators.required],
      FirmName: ['', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+'),Validators.minLength(3), Validators.maxLength(99)]],  
      OwnerName: ['',[Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+'),Validators.minLength(2), Validators.maxLength(70)]],
      CPName : ['', [Validators.required,Validators.minLength(2), Validators.maxLength(70)]],
      
     
      
      GSTIN:[null,[Validators.pattern,Validators.min(15),Validators.maxLength(15)]],
      PostalCode : ['', Validators.required],
      Address : ['',Validators.maxLength(250)],
      WorkingStateId:[null, Validators.required]
    });

      for (let key of Object.keys(this.isFieldRequired)) {        
        if(this.isFieldRequired[key]){
          this.registrationForm.get(key).setValidators(Validators.required);
        }            
      }
      //this.isFieldRequired=null;
      let vCounter=0;
      for (var val of Object.keys(this.formValidationData)) {
        console.log('data checker test---',this.formValidationData[val].DisplayName);
        //this.isFieldRequired1(this.formValidationData[val].DisplayName);
        //Object.keys(this.isFieldRequired1).map(p=>this.formValidationData[val].DisplayName);
        //console.log('data checker--',val.Name,val.IsRequired);
        //this.isFieldRequired1[vCounter][val.Name]=val.IsRequired;
        //this.isFieldRequired1[this.formValidationData[val].DisplayName]="";
        // Object(this.isFieldRequired1).key(p=>this.formValidationData[val].DisplayName,"");
        // this.isFieldRequired1(this.formValidationData[val].DisplayName);
        // console.log('data checker---',this.isFieldRequired1);
        this.isFieldRequired1.pipe().map(p=>p.key==this.formValidationData[val].DisplayName);
        vCounter=vCounter+1;
      }
      console.log('data checker--',this.isFieldRequired1);
  }
  get f() { return this.registrationForm.controls; }
  ngOnInit(): void {
    console.log('test by prashant');
    this.createRegistrationForm(); 
    console.log('test by prashant1');
    console.log('data-test',this.formValidationData.filter(p => p.Name == "FirstName").length);
  }

  

}
