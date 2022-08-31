import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { HomeService } from 'src/app/services/home.service';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';
declare var $: any;

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent   implements OnInit {
  isFormSuccess: boolean = false;
  purchaseDaysList: any = [
  { "Id": 1, "Name": "1 हफ्ते में(In 1 week)" }, 
  { "Id": 2, "Name": "10 दीनो में(In 10 days)" }, 
  { "Id": 3, "Name": "20 दीनो में(In 20 days)" },
  { "Id": 4, "Name": "1 महीने में(in 1 month)" }, 
  { "Id": 5, "Name": "2 महीने में(In 2 month)" }
 ];

  brandProduct: any = [
  { "Id": 94, "Name": "सोनालीका(SONALIKA)" },
  { "Id": 155, "Name": "न्यू हॉलैंड(NEW HOLLAND)" },
  { "Id": 145, "Name": "फार्म ट्रेक(FARMTRAC)" },
  { "Id": 167, "Name": "पॉवर ट्रेक(POWERTRAC)" },
  { "Id": 149, "Name": "डीजी ट्रेक(DIGITRAC)" },
  { "Id": 168, "Name": "आईशर(EICHER)" },
  { "Id": 144, "Name": "जॉन डियर(JOHN DEERE)" },
  { "Id": 169, "Name": "टैफे(TAFE)" },
  { "Id": 137, "Name": "महिंद्रा(MAHINDRA)" },
  { "Id": 170, "Name": "एचएमटी(HMT)" },
  { "Id": 171, "Name": "बलवान ट्रैक्टर्स(BALWAN)" },
  { "Id": 139, "Name": "प्रीत ट्रैक्टर्स(PREET)" },
  { "Id": 172, "Name": "स्टैंडर्ड ट्रैक्टर्स(STANDARD)" }
  ];
  stateList: any = [
  { "Id": 15, "Name": "उत्तर प्रदेश(UTTAR PRADESH)" },
  { "Id": 5, "Name": "हिमाचल प्रदेश(HIMACHAL PRADESH)" }, 
  { "Id": 3, "Name": "बिहार(BIHAR)" }, 
  { "Id": 10, "Name": "मध्य प्रदेश(MADHYA PRADESH)" },
  { "Id": 9, "Name": "महाराष्ट्रा(MAHARASHTRA)" }, 
  { "Id": 4, "Name": "गुजरात(GUJARAT)" }, 
  { "Id": 13, "Name": "राजस्थान(RAJASTHAN)" }, 
  { "Id": 23, "Name": "उत्तराखंड(UTTARAKHAND)" },
  { "Id": 6, "Name": "हरयाणा(HARYANA)" }, 
  { "Id": 1, "Name": "आन्ध्र प्रदेश(ANDHRA PRADESH)" }, 
  { "Id": 22, "Name": "तेलंगाना(TELANGANA)" }, 
  { "Id": 21, "Name": "छत्तीसगढ़(CHHATTISGARH)" }
  ];

  districtList: any = [];
  showHint: boolean = false;
  stateName: any
  districtName: any
  stateId: any
  districtId: any
  leadForm: FormGroup;
  mobileNo: any;
  leadSourceId: any;
  constructor(
    private homeService: HomeService,
    private globalService: GlobalService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private metaService:MetaService
  ) {

    this.route.params.subscribe(res => this.leadSourceId = res["id"]);
  }
  ngOnInit(): void {
    this.metaService.updateMeta('/bz/lead', null);
    this.createLeadForm();
  }

  onLoginSubmit() {
    if (this.leadForm.invalid) {
      return false;
    }
    let vData = this.leadForm.getRawValue();
    vData["state"] = parseInt(vData["state"].split(' ')[0]);
    vData["brandProduct"] = parseInt(vData["brandProduct"].split(' ')[0]);
    vData["purchaseDays"] = parseInt(vData["purchaseDays"].split(' ')[0]);
    vData["leadSourceId"] = this.leadSourceId;
    console.log('button clicked', vData);


    this.homeService.getLeadGeneration(vData).subscribe((res: any) => {
      console.log('response api: ', res);
      this.isFormSuccess = true;
      this.leadForm.reset();
    }, err => console.log(err))
  }

  createLeadForm() {
    this.leadForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z \u0900-\u097F]+')]],
      purchaseDays: [null, Validators.required],
      state: [null, Validators.required],
      district: [null, Validators.required],
      village: [null, Validators.required],
      brandProduct: [null, Validators.required],
      mob: ['', [Validators.required, Validators.pattern('^[6789][0-9]{9}$')]],
      email: ['', [Validators.required, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]]
    })
  }

}
