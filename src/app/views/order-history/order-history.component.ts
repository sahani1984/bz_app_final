import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { GlobalService } from 'src/app/services/global.service';

import * as moment from 'moment';
import { MetaService } from 'src/app/services/meta.service';
import { Router } from '@angular/router';
import { CheckoutService } from 'src/app/services/checkout.service';


@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent   implements OnInit {
  orderHistory: any = [];
  isLoaded: boolean = false;
  viewType: any = "orderHistoryView"
  constructor(private globalService: GlobalService,
    private checkoutService:CheckoutService,
    private router:Router,
    private toastr: ToastrService, 
    private metaService:MetaService ) {


  }

  ngOnInit(): void {
    this.metaService.updateMeta('/bz/order-history', null);
    this.getOrder();
  }
  reload(){
    this.orderHistory = [];
    this.getOrder();
  }

  getOrder() {
    let farmerID = localStorage.getItem('FarmerId');
    this.orderHistory = [];
    this.globalService.getOrderHistory(farmerID).subscribe(
      res => {
        console.log(res);
        if (res["Status"]) {
          this.orderHistory = res["OrderRecords"].OrderRecords;                
          this.orderHistory.forEach((element, index) => {
            this.orderTracking(element, index);
          });         
        }
      },
      err => console.log(err),
      () => this.isLoaded = true
    )
  }

  reOrderItem(data:any){   
    if (data.Sellerid) {
      this.router.navigate(['/bz/checkout', data.BzProductId], { queryParams: { dealerid: data.Sellerid, category: data.CategoryHindi } });
    }
    else {
      this.router.navigate(['/bz/checkout', data.BzProductId], { queryParams: { category: data.CategoryHindi  } });
    }
  }


  orderStatus: any
  orderTracking(data, i) {
    this.globalService.getOrderStatus(data.PackageId, data.orderid).subscribe(
      res => {
        if (res["Status"] == true) {
          this.orderStatus = res["CancelReason"];       
          this.orderHistory.forEach(element => {
            if (element.orderid == this.orderStatus.CancelReason[0].OrderID) {
              element.trackingHistory = this.orderStatus
            }
          });
        }
      },
      err => console.log(err)
    )
  }



  reasonListArr: any = [];
  cancelItem:any;
  cancelOrReturn(typeid, recordid, tracking) {
    this.typeId = typeid;
    this.recordId = recordid;
    this.cancelItem = tracking?.CancelReason[0]
    console.log(this.cancelItem)
    this.globalService.cancelReturnOrder(typeid).subscribe(
      res => {
        if (res["Status"]) {         
          this.reasonListArr = res["ProductCancelStatus"].ProductCancelStatus;
          this.viewType = "cancelOrderView"
          this.favoriteReason = this.reasonListArr[0].id;          
        }
      },
      err => console.log(err)
    )
  }



  favoriteReason: any;
  RecordId: any = "";
  typeId: any = null
  recordId: any = null;
  other_reason: any = ""
  submitReason() {   
    let resonData = this.reasonListArr.filter(item => item.id == this.favoriteReason);
    console.log(resonData)
    let obj = {};
    obj["FarmerId"] = Number(localStorage.getItem('FarmerId'));
    obj["CancelReasonId"] = resonData[0].id;
    obj["RecordId"] = this.recordId;
    obj["TypeId"] = this.typeId;
    obj["CancelReason"] = resonData[0].CancelReason !== "Other" ? resonData[0].CancelReason : this.other_reason
    console.log(obj);
    this.globalService.cancelReason(obj).subscribe(
      res => {
        console.log(res);
        if (res["Status"] == true) {
          this.orderHistory = [];
          this.viewType = "orderHistoryView";
          this.other_reason = ""
          this.toastr.success('Your request has been submitted successfully.', 'Success!');          
          this.getOrder();
          if (this.cancelItem?.PaymentType!=='COD'){
            this.refundPayRequest(this.cancelItem?.rzp_paymentid, this.cancelItem?.TotalPayableAmount,)
          }
        }
      },
      err => this.toastr.error('Something went wrong.', 'Error!')
    )
  }



  // FOR UPLOADING AND  CREATING BASE64 IMAGE
  proImgUrl: any = ""
  public imagePath;
  imgURL: any;
  public message: string;
  preview(files, imgview) {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.globalService.uploadFiles(this.imgURL, 'something').subscribe(console.log);
      this.proImgUrl = this.imgURL
      this.feedbackObj[imgview]["FileAsBase64"] = this.proImgUrl;
      this.feedbackObj[imgview]["FileSize"] = files[0].size;
      this.feedbackObj[imgview]["FileType"] = files[0].type;
      this.feedbackObj[imgview]["LastModifiedTime"] = moment().toDate().getTime();
      this.feedbackObj[imgview]["LastModifiedDate"] = moment(new Date()).format();
    }
  }


  /**REFUND REQUEST IN CASE OF FAILED PAYMENT**/
  refundPayRequest(rzpPaymentIds, amount) {
    let obj = {};
    obj["rzp_paymentid"] = rzpPaymentIds
    obj["amount"] = amount
    obj["IsPartialRefund"] = 0;
    this.checkoutService.refundPayRequest(obj).subscribe(
      (res) => {
        console.log(res);
        if (res["Success"]) {
          this.toastr.success('Your refund request created successfully', 'Success!!');
        }
        console.log(res);
      },
      (err) => console.log(err)
    )
  }


  // FOR STAR RATING 
  starCount: number = 5;
  onRatingChanged(rating) {
    this.feedbackObj["rating"] = rating
  }

  feedbackObj = {
    sellerid: null,
    packageid: null,
    review: "",
    rating: null,
    buyerid: "",
    orderid: "",
    LeftSideImageFileSource: {
      FileAsBase64: "",
      FileSize: null,
      FileType: "",
      LastModifiedTime: "",
      LastModifiedDate: null
    },
    RightSideImageFileSource: {
      FileAsBase64: "",
      FileSize: null,
      FileType: "",
      LastModifiedTime: "",
      LastModifiedDate: null
    },
    FrontSideImageFileSource: {
      FileAsBase64: "",
      FileSize: null,
      FileType: "",
      LastModifiedTime: "",
      LastModifiedDate: null
    },
    BackSideImageFileSource: {
      FileAsBase64: "",
      FileSize: null,
      FileType: "",
      LastModifiedTime: "",
      LastModifiedDate: null
    }
  }




  goToFeedback(data) {
    this.viewType = "writeFeedbackView"
    this.feedbackObj["packageid"] = data.PackageId;
    this.feedbackObj["sellerid"] = data.Sellerid;
    this.feedbackObj["orderid"] = data.orderid.toString()
    this.feedbackObj["buyerid"] = localStorage.getItem('FarmerId');
  }



  submitReview() {
    console.log(this.feedbackObj);
    this.globalService.ProductReviewAndRating(this.feedbackObj).subscribe(
      (res) => {
        console.log(res);
        if (res["Status"]) {
          this.toastr.success('Your feedback has been submitted successfully', 'Success!');
        } else {
          this.toastr.error('Something went wrong', 'Error!')
        }
      },
      (err) => console.log(err)
    )
    this.viewType = "orderHistoryView";
  }




  public initiateStp(status, returnstatus, classfirst, classsecond) {
    if (returnstatus == 1) {
      if ((status == 'Initiated') || (status == 'Pending for re-confirmation') || (status == 'Confirmed') || (status == 'Out for Delivery') || (status == 'Delivered')) {
        return classfirst;
      } else return classsecond;
    } else {
      return classsecond;
    }
  }

  public pendingCnfStp(status, returnstatus, classfirst, classsecond) {
    if (returnstatus == 1) {
      if ((status == 'Pending for re-confirmation') || (status == 'Confirmed') || (status == 'Out for Delivery') || (status == 'Delivered')) {
        return classfirst;
      } else return classsecond;
    } else {
      return classsecond;
    }
  }

  public confirmStp(status, returnstatus, classfirst, classsecond) {
    if (returnstatus == 1) {
      if ((status == 'Confirmed') || (status == 'Out for Delivery') || (status == 'Delivered')) {
        return classfirst;
      } else return classsecond;
    } else {
      return classsecond;
    }
  }

  public outforDeliveryStp(status, returnstatus, classfirst, classsecond) {
    if (returnstatus == 1) {
      if ((status == 'Out for Delivery') || (status == 'Delivered')) {
        return classfirst;
      } else return classsecond;
    } else {
      return classsecond;
    }
  }

  public deliverdStp(status, returnstatus, classfirst, classsecond) {
    if (returnstatus == 1) {
      if ((status == 'Delivered')) {
        return classfirst;
      } else return classsecond;
    } else {
      return classsecond;
    }
  }
}
