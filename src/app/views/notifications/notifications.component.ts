import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent   implements OnInit {
  notificationList:any = [];
  isLoaded:boolean=false
  constructor(
    private globalService:GlobalService,
    private router: Router, private metaService:MetaService){

    this.globalService.loginUserObj.subscribe(res=>{
      if(!res["FarmerID"])  this.router.navigate(['/'])
    });
  }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/notifications', null);
    this.getNotification();
  }

  getNotification(){
    let farmerID = localStorage.getItem('FarmerId');
    this.globalService.getNotificationsHistory(farmerID).subscribe(
      res =>{        
        if(res["Status"]){       
          this.notificationList = res["BuyerDealDetails"].BuyerDealAlert
          console.log(this.notificationList);
        }
      },
      err=> console.log(err),
      () => this.isLoaded = true
    )
  }
  goToProdcutDetail(item){
    console.log(item);
  }

}
