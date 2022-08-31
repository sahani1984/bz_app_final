import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';
import { CategoryService } from 'src/app/services/category.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { GlobalService } from 'src/app/services/global.service';
import { LoginComponent } from '../../login/login.component';
import { MetaService } from 'src/app/services/meta.service';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productId: any;
  districtId: any;
  dealerDetails: any = [];
  productDetails: any = [];
  desc: any = [];
  productAvailability: boolean = true;
  dealersAvailability: boolean = true;
  dealersMessage: string;
  globalBuyWrapper: boolean = true;
  dealerID: any;
  latData: any;
  ItemCategoryTitle: any = ''
  districtResult: any;
  farmerId: any;
  mobileNo: any;
  state: any;
  isManualLocation: boolean;
  imageViewThumb:boolean=false;

  videoUrl: any = "https://www.youtube.com/embed/IIWOz77-LJ0?autoplay=1&mute=1&playsinline=1"

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private location: Location,
    private metaService:MetaService,
    public sanitizer: DomSanitizer,
    private ref: ChangeDetectorRef) {
      this.route.queryParams.subscribe(res => this.ItemCategoryTitle = res["category"]);
      this.globalService.isManualLocation.subscribe((res: any) => this.isManualLocation = res);
      this.route.params.subscribe(res => this.productId = res["productId"]);
  }

 
  goToEnquiry(id: number, typeId: number, categoryId?: number, dealerId?: number) {
    let obj = {};
    obj["id"] = id
    obj["typeId"] = typeId
    obj["categoyId"] = categoryId
    obj["dealerId"] = dealerId
    this.globalService.onProductEnquiryClick(obj);
  }
  ngOnInit(): void {
    this.metaService.updateMeta('/bz/product-detail', null);
     this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.getProductDetailsMaster();
      }
    });
    this.getProductDetailsMaster();   
  }

  getProductDetailsMaster() {
    const latData = localStorage.getItem('lat');
    const longData = localStorage.getItem('long');
    this.farmerId = localStorage.getItem('FarmerId');
    this.mobileNo = localStorage.getItem('farmerMob');
    this.districtId = localStorage.getItem('districtId');
    if (this.productId) {
      if ((this.isManualLocation == false) && !this.districtId) {
        if (latData && longData && !this.farmerId) {
          console.log('Option 1')
          this.getProductDetail(this.productId, 0, latData, longData);
        }
        if (this.farmerId && latData && longData) {
          console.log('Option 2')
          this.getProductDetailWithFarmerId(this.productId, 0, this.farmerId, latData, longData);
        }
      } else {
        if (this.districtId && !this.farmerId) {
           console.log('Option 3')
          this.getProductDetail(this.productId, this.districtId, 0, 0);
        }
        if (this.farmerId && this.districtId) {
          this.getProductDetailWithFarmerId(this.productId, this.districtId, this.farmerId, 0, 0);
        }
      }
    }
  }



productsImages:any=[];
selectedIndex:number=0
bigImage:any=""
  getProductDetail(ProductId, Districtid, lat, lon) {
    this.categoryService.getProductDetails(ProductId, Districtid, lat, lon).subscribe((res: any) => {
      console.log(res);
      if (res.Status) {
        if (res.BZApiReponse) {
          this.productDetails = JSON.parse(JSON.stringify(res.BZApiReponse.ProductDetails || null));
          this.productsImages = JSON.parse(JSON.stringify(res.BZApiReponse.ImageUrlPath || []));
          this.dealerDetails = JSON.parse(JSON.stringify(res.BZApiReponse.DealerDetails || null));        
          this.productAvailability = true;
          if (this.productDetails[0].VideoUrl == null || (this.productDetails[0].VideoUrl == 'NULL')) {
            this.bigImage = this.productsImages[0].ImagePath;
            this.selectedIndex = 0;
            this.imageViewThumb = true;
          } else {
            this.selectedIndex = null
          } 
          if (this.productDetails.length > 0) {
            let data = [];
            this.productDetails.forEach(element => {
              data.push(element.Description);
              return data;
            });         
            if (data[0]) {            
              for (const [key, value] of Object.entries(JSON.parse(data[0]))) {
                if (value && value !== 'null' && value !== 'NULL') {
                  this.desc.push({ key: key, value: value });
                }
              }
            }
          } else {
            this.productAvailability = false;
          }
          if (this.dealerDetails.length > 0) {

            if (this.state == 'HARYANA') {
              let isDelivery = this.dealerDetails.some((item: any) => item.IsDeliveryAvailable == 1)
              if (isDelivery) this.globalBuyWrapper = false;            
            } else if (this.state !== 'HARYANA') {
              //change by prashant
              let isSelfDealerV1 = this.dealerDetails.filter((item: any) => item.IsDeliveryAvailable == 1);
              if (isSelfDealerV1 != null && isSelfDealerV1.length > 0) {
                this.globalBuyWrapper = false;

              }
              else {
                let isSelfDealer = this.dealerDetails.filter((item: any) => item.IsDeliveryAvailable == 2);
                if (Object.keys(isSelfDealer).length) this.dealerID = isSelfDealer[0].dealerId;
              }
              //end change   

            }
          } else {
            if (this.state == 'HARYANA') {
              if (this.productDetails[0].IsDeliveryAvailable == 1) {
                this.globalBuyWrapper = false;
              } else {
                this.globalBuyWrapper = true;
                //only show enquiry button
                this.dealersAvailability = false;
              }
            } else {
              this.globalBuyWrapper = true;
              this.dealersAvailability = false;
              //only show msg with enquiry
              this.dealersMessage = res.MSG[0].Msg;
            }
          }
        }
      } 
    }, err => {
      console.log(err);
    })
  }

  getProductDetailWithFarmerId(ProductId, Districtid, FarmerId, lat, lon) {
    this.categoryService.getProductDetailsWithFarmerId(ProductId, Districtid, FarmerId, lat, lon).subscribe((res: any) => {
      if (res.Status) {
        if (res.BZApiReponse) {
          this.productDetails = JSON.parse(JSON.stringify(res.BZApiReponse.ProductDetails || null));
          this.productsImages = JSON.parse(JSON.stringify(res.BZApiReponse.ImageUrlPath || []));             
          this.dealerDetails = JSON.parse(JSON.stringify(res.BZApiReponse.DealerDetails || null));
          this.productAvailability = true;
          if (this.productDetails[0].VideoUrl == null || (this.productDetails[0].VideoUrl == 'NULL')){
            this.bigImage = this.productsImages[0]?.ImagePath; 
            this.selectedIndex = 0;
            this.imageViewThumb = true;
          }else{
            this.selectedIndex = null
          }         
          if (this.productDetails.length > 0) {
            let data = [];
            this.productDetails.forEach(element => {
              data.push(element.Description);
              return data;
            });

            if (data[0]) {
              for (const [key, value] of Object.entries(JSON.parse(data[0]))) {
                if (value && value !== 'null' && value !== 'NULL') {
                  this.desc.push({ key: key, value: value });
                }
              }
            }
          } else {
            this.productAvailability = false;
          }
          if (this.dealerDetails.length > 0) {
            if (this.state == 'HARYANA') {
              let isDelivery = this.dealerDetails.some((item: any) => item.IsDeliveryAvailable == 1)
              if (isDelivery) {
                this.globalBuyWrapper = false;
              }
              if (this.globalBuyWrapper) {
                if (this.productDetails[0].IsDeliveryAvailable == 1) {
                  this.globalBuyWrapper = false;
                }
              }
            } else if (this.state !== 'HARYANA') {
              let isSelfDealer = this.dealerDetails.filter((item: any) => item.IsDeliveryAvailable == 2);
              if (Object.keys(isSelfDealer).length) this.dealerID = isSelfDealer[0].dealerId;
              let isSelfDealerGBN = this.dealerDetails.filter((item: any) => item.IsDeliveryAvailable == 1);
              if (Object.keys(isSelfDealerGBN).length) {
                //prashant rnd changes               
                this.globalBuyWrapper = false;
                this.dealersAvailability = false;
              }
            }
          } else {
            if (this.state == 'HARYANA') {
              if (this.productDetails[0].IsDeliveryAvailable == 1) {
                this.globalBuyWrapper = false;
              } else {
                this.globalBuyWrapper = true;
                this.dealersAvailability = false;
              }
            } else {
              this.globalBuyWrapper = true;
              this.dealersAvailability = false
              this.dealersMessage = res.MSG[0].Msg;
            }
          }
        }
      }
    }, err => {
      console.log(err);
    })
  }


  openModal(item) {
    if (this.farmerId == null) this.login();
    if (this.farmerId) {
      this.categoryService.getBestDeal(item.RecordId, this.mobileNo, this.farmerId, item.dealerId).subscribe((res: any) => {
        if (res.Status) {
          this.dialog.open(DialogComponent, {
            data: res.Msg[0].Msg
          });
        }
      })
    }
  }

  globalBuyBtn() {
    this.farmerId = localStorage.getItem('FarmerId')
    if (this.farmerId == null) {
      this.login();
    } else {
      if (this.farmerId) {
        if (this.dealerID) {
          this.router.navigate(['/bz/checkout', this.productId], { queryParams: { dealerid: this.dealerID, category: this.ItemCategoryTitle } });
        }
        else {
          this.router.navigate(['/bz/checkout', this.productId], { queryParams: { category: this.ItemCategoryTitle } });
        }
      } else {
        this.login();
      }
    }
  }

  goToBack() {
    this.location.back();
  }

  changeImage(imgPath:any, index:number){    
    this.imageViewThumb = true;
      this.bigImage = imgPath;
      this.selectedIndex = index;
  }

  hideVideo(){
    this.imageViewThumb = true; 
    this.selectedIndex = 0;
    this.bigImage = this.productsImages[0]?.ImagePath
  }

  login() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      "callingFrom": "Login",
      "id": 0,
      "typeId": 0,
      "location": ""
    };
    const dialogRef = this.dialog.open(LoginComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (this.dealerID) {
        this.router.navigate(['/bz/checkout', this.productId], { queryParams: { dealerid: this.dealerID, category: this.ItemCategoryTitle } });
      }
      else {
        this.router.navigate(['/bz/checkout', this.productId], { queryParams: { category: this.ItemCategoryTitle } });
      }
      console.log(`Dialog result: ${result}`);
    });
  }
  matchYoutubeUrl(url) {
    if(!url) this.selectedIndex = 0;
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
}
}
