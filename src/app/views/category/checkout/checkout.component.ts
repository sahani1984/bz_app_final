import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
//import { DialogComponent } from '../../shared/dialog/dialog.component';
import { CheckoutService } from 'src/app/services/checkout.service';
import { GlobalService } from 'src/app/services/global.service';
import { LoginComponent } from '../../login/login.component';
import { ToastrService } from 'ngx-toastr';
import { MetaService } from 'src/app/services/meta.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatRadioChange } from '@angular/material/radio';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent   implements OnInit {
  districtId: any;  // NOT IN USE
  productId: any;
  quantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  paymentmode: any ="online_payment"
  addressValue: any;
  couponValue: any;
  stateName: any;
  districtName: any;
  dealerID: any;
  profileCopleted:boolean;
  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _location: Location,
    private checkoutService: CheckoutService,
    private toastr: ToastrService,
    private metaService: MetaService,
    private authservices: AuthService,
    private commonServices:CommonService,
    private globalService: GlobalService) {
    this.commonServices.isProfileCopleted.subscribe(res=> {      
        this.profileCopleted = res;
    });
    this.route.queryParams.subscribe(res => this.dealerID = res["dealerid"]);
    this.checkoutService.excecuteCompletePayment.subscribe((res) => {
      if (res) this.completePaymentRequest(res);
    })
  }

 
  ngOnInit(): void {
    this.metaService.updateMeta('/bz/checkout', null);
    this.getProduct()
  }

  /**GET PRODUCT DETAILS**/
  farmerId: any;
  farmerName: any;
  farmerMob: any;
  farmerDistrictId: any;
  farmerStateId: any;
  address: any;
  isCouponApplied: boolean = false;
  discountAmount: number = 0;
  validateCoupon() {
    if (!this.isCouponApplied) {
      this.checkoutService.validateCoupon(this.farmerId,
        this.productDetails[0].PackageID,
        this.couponValue,
        this.quantityValue,
        this.totalAmount
      ).subscribe((res: any) => {
        let data = res.BZReponse.CouponDtl[0];
        if (data["CouponApplied"] == "True") {
          if (data["DiscountedAmount"] > 0) {
            this.discountAmount = data["DiscountedAmount"];
            this.isCouponApplied = true;
            this.toastr.success(data.Msg, 'Success!!');
          }
        }
        else {
          //Invalid Coupon
          this.toastr.error(data.Msg, 'Soory!!');
          console.log('Invalid Coupon');
        }
      });
    }


  }
  getProduct() {
    this.route.params.subscribe((res: any) => {
      const user_details = JSON.parse(localStorage.getItem('farmer_dtl'));      
      this.stateName = user_details.StateName;
      this.districtName = user_details.DistrictName
      const lat = Number(localStorage.getItem('lat') || 0);
      const lon = Number(localStorage.getItem('long') || 0);
      this.productId = res.productId;
      this.farmerId = user_details.FarmerID
      this.farmerName = user_details.FirstName + " " + user_details.LastName
      this.farmerMob = user_details.MobileNumber
      this.farmerDistrictId = user_details.DistrictId || 0
      this.farmerStateId = user_details.StateId
      this.address = user_details.Address
      if (this.address) {
        this.addressValue = this.address;
      }
      if (this.farmerId) {
        this.getProductDetailWithFarmerId(this.productId, this.farmerDistrictId, this.farmerId, lat, lon);
        this.farmerDetailsfarmerDetails(this.farmerId);
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          "callingFrom": "Login",
          "id": 0,
          "typeId": 0,
          "location": ""
        };
        const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
      }
    })
  }

  /**GET PRODUCT DETAILS WITH FARMER ID**/
  totalQuantity: any
  totalAmount: any
  singleItemPrice: number;
  productDetails: any = [];
  getProductDetailWithFarmerId(ProductId, Districtid, FarmerId, lat, lon) {
    this.categoryService.getProductDetailsWithFarmerId(ProductId, Districtid, FarmerId, lat, lon).subscribe((res: any) => {
      if (res.Status) {
        if (res.BZApiReponse) {
          this.productDetails = res["BZApiReponse"].ProductDetails
          this.totalQuantity = this.productDetails[0].Quantity;
          this.totalAmount = this.productDetails[0].OnlinePrice;
          this.singleItemPrice = this.productDetails[0].OnlinePrice;
        }
      }else{
        this.toastr.warning(res['MSG'][0].Msg, 'Sorry!!');
        this.router.navigate(['/']);
      }
    }, err => console.log(err))
  }

  /**SET PRICE WITH RESPECT OF QUANTITY**/
  quantityValue: any = 1
  selectedValue(value) {
    this.quantityValue = Number(value);
    this.totalAmount = this.singleItemPrice * this.quantityValue;
    this.discountAmount = 0;
    this.isCouponApplied = false;
    this.couponValue = "";
  }

  /**CHECKOUT THE ITEM**/
  checkout() { 
    if (!this.profileCopleted) {
      this.router.navigate(['/bz/profile'], { queryParams: { info: 'Update Profile' } });
      this.toastr.warning('Please complete your profile to place order.', 'Warning!!');
      return;
    }

  let userIds: any;
      if (this.stateName === 'HARYANA') {
        userIds = 0;
      } else {
        userIds = this.dealerID
      }
      let vLeadSource: string = '';
      if (sessionStorage.getItem("SourceName") != null && sessionStorage.getItem("SourceName") != undefined) {
        vLeadSource = sessionStorage.getItem("SourceName");
      }
      let obj = {};
      obj["state"] = this.stateName;
      obj["district"] = this.districtName;
      obj["farmerId"] = this.farmerId;
      obj["packageID"] = this.productDetails[0].PackageID;
      obj["quantity"] = this.quantityValue;
      obj["recordID"] = this.productDetails[0].RecordID;
      obj["farmerName"] = this.farmerName;
      obj["farmerMob"] = this.farmerMob;
      obj["address"] = this.addressValue;
      obj["districtID"] = this.farmerDistrictId;
      obj["stateID"] = this.farmerStateId;
      obj["userId"] = userIds;
      obj["LeadSource"] = vLeadSource;
      obj["paymentMode"] = this.paymentmode;
      obj["OnlinePrice"] = this.totalAmount;      
     this.checkoutService.checkout(obj).subscribe((res: any) => {        
        if (res.Status == 1) {
          if (this.paymentmode =='online_payment'){
          localStorage.setItem('checkout', JSON.stringify(res));      
          this.customerPayReq(this.farmerId, res["OrderId"]);
          }else{
           this.toastr.success('Your order has been created successfully', 'Success!!');      
           this.router.navigate(['/']);
          }
        } else {
          this.toastr.error('We are not serving in your area,We will serve soon.', 'Sorry!!');
        }
      })      
  }


  /**GET PAYMENT RELATED INFO TO PROCEED THE RAZORPAY**/
  customerPayReq(formerIds: any, orderIds) {
    let obj = {};
    obj["name"] = this.farmerName;
    obj["email"] = ""
    obj["contactNumber"] = this.farmerMob;
    obj["address"] = this.addressValue;
    obj["amount"] = this.totalAmount;
    this.checkoutService.customerPayRequest(obj).subscribe(
      (res) => {
        if (res["Status"]) {
          console.log(res);
          this.razorPay(res["BZApiReponse"].ModelResponse, formerIds, orderIds)
        }
      },
      (err) => console.log(err)
    )   
  }

  /**RAZOR PAY**/
  razorPay(data: any, formerIds: any, orderIds) {
    let option = {
      "handler": function (response) {
        let obj = {};
        obj["rzp_paymentid"] = response.razorpay_payment_id;
        obj["rzp_orderid"] = response.razorpay_order_id;
        obj["rzp_Signature"] = response.razorpay_signature;
        obj["farmerId"] = formerIds;
        obj["bz_orderid"] = orderIds;
        obj["amount"] = Number(data.amount / 100).toFixed(2);
        console.log(obj);
        this.completePaymentRequest(obj);
        this.setOrderStatus(orderIds, 'SUCCESS');
      }.bind(this),
      "prefill": {
        "name": data.name,
        "email": data.email,
        "contact": data.contactNumber
      },
      "notes": { "address": "Razorpay Corporate Office" },
      "theme": { "color": "#3399cc" },
      "modal": {
        "ondismiss": function () {
          console.log('escaped****')
          this.setOrderStatus(orderIds, 'CANCEL');
        }.bind(this)
      }
    };
    option["key"] = data.razorpayKey;
    option["amount"] = Number(data.amount / 100).toFixed(2);
    option["currency"] = data.currency;
    option["name"] = data.name;
    option["description"] = data.description;
    option["image"] = "https://behtarzindagi.in/index/assets/img/BZ_logo_normal.png";
    option["order_id"] = data.orderId;
    const rzp = new this.authservices.nativeWindow.Razorpay(option);
    rzp.on('payment.failed', function (res) {    
      this.setOrderStatus(orderIds, 'CANCEL');
      this.refundPayRequest(res.error.metadata.payment_id, data.amount);
    })
    rzp.open();
  }

 
  /**SAVE PAYMENT INFORMATION IN CASE OF SUCCESSFUL PAYMENT**/
  completePaymentRequest(data: any) {
    const clientIfo = JSON.parse(sessionStorage.getItem('thirdPartyClient'));   
    this.checkoutService.completePayRequest(data).subscribe(
      (res) => {
        if (res["Status"]) {
          console.log(res)
          this.toastr.success('Your order has been created successfully', 'Success!!');          
          if (clientIfo?.PartnershipID) {
            this.saveThiredPartyClientInfo(clientIfo.PartnershipID, data.farmerId, data.bz_orderid, this.farmerMob)
          }
          this.router.navigate(['/bz/order-history']);
        }
      },
      (err) => console.log(err)
    )
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


  setOrderStatus( orderIds:any, status:any){
    let obj = {};
    obj["OrderId"] = orderIds;
    obj["PaymentStatus"] = status;   
    this.checkoutService.orderStatus(obj).subscribe(
      (res:any)=>console.log(res),
      (err)=> console.log(err)
    )
  }


  saveThiredPartyClientInfo(partnerIds: any, farmerIds: any, orderIds: any, mobile: any) {
    let obj: any = {};
    obj["Client"] = partnerIds;
    obj["FarmerID"] = farmerIds;
    obj["OrderID"] = orderIds;
    obj["MobNo"] = mobile
    console.log(obj);
    this.checkoutService.clientFarmerInfo(obj).subscribe(
      (res:any)=> {
        if (res["Status"]){
          console.log(res);
        }      
      },
      (err:any)=> console.log(err)
    )
  }


  /**GO BACK**/
  goToBack() {
    this._location.back();
  }


  farmerAddresDtl:any;
  farmerDetailsfarmerDetails(formerIds) {    
    this.globalService.getExistingFarmerDetails(formerIds).subscribe(
      res => {
        if (res["Status"]) {
          this.farmerAddresDtl = res["BZAppFarmerAddress"];                
        }
      },
      err => console.log(err)
    )
  }



}
