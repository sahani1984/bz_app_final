import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-cancel-return',
  templateUrl: './cancel-return.component.html',
  styleUrls: ['./cancel-return.component.css']
})
export class CancelReturnComponent implements OnInit {

  constructor(
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private metaService:MetaService
  ) { }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/cancel-return-order', null);
    this.getReasonList();
  }


  reasonListArr: any = [];
  getReasonList() {
    this.route.queryParams.subscribe(res => {
      if (res.TypeId) {
        this.globalService.cancelReturnOrder(res.TypeId).subscribe(
          res => {
            if (res["Status"]) {
              this.reasonListArr = res["ProductCancelStatus"].ProductCancelStatus;
              console.log(this.reasonListArr);
            }
          },
          err => console.log(err)
        )
      }
    })
  }

  favoriteReason: any = "";
  RecordId: any = "";
  typeId: any = null
  recordId: any = null
  submitReason() {
    console.log(this.favoriteReason);
    let resonData = this.reasonListArr.filter(item => item.id == this.favoriteReason);
    let obj = {};
    obj["FarmerId"] = Number(localStorage.getItem('FarmerId'));
    obj["CancelReasonId"] = resonData[0].id;
    obj["RecordId"] = this.recordId;
    obj["TypeId"] = this.typeId;
    obj["CancelReason"] = resonData[0].CancelReason;
    console.log(obj);
    this.globalService.cancelReason(obj).subscribe(
      res => {
        if (res["Status"] == true) {
          console.log(res);
        }
      },
      err => console.log(err)
    )
  }

}
