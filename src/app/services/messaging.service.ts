import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { API_PATH } from '../utilis/app.config';
@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  getToken = new BehaviorSubject<any>(null);  

  constructor(
    private httpClient: HttpClient,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    // private angularFireMessaging: AngularFireMessaging,
    private angularFireMessaging: AngularFireMessaging
    ) {   
    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */

  // updateToken(userId, token) {     
  //   this.angularFireAuth.authState.pipe(take(1)).subscribe(
  //     () => {       
  //       const data = {};
  //       data[userId] = token
  //       this.angularFireDB.object('behatazindagi_id/').update(data)
  //     })
  // }

  /**
   * request permission for notification from firebase cloud messaging 
   */
  // requestPermission() {
  //   this.angularFireMessaging.requestToken.subscribe(
  //     (token) => {
  //       this.getToken.next(token);       
  //       this.postTokenDetails(token);
  //     },
  //     (err) => {
  //       console.error('Unable to get permission to notify.', err);
  //     }
  //   );
  // }

  /**
   * hook method when new notification received in foreground
   */
  // receiveMessage() {
  //   this.angularFireMessaging.messages.subscribe(
  //     (payload) => {
  //        console.log("new message received. ", payload);
  //       this.currentMessage.next(payload);
  //     })
  // }
  // Sending the payload with fcm url
  // this requires server token


  


  // sendPushMessage(obj:any){
  //   let data = {
  //       "notification": {
  //       "title": obj.title,
  //       "body": obj.message,
  //       "click_action": "https://behtarzindagi.in/",
  //            "icon": "./assets/images/small_banner.png",
  //            "sound" : "default"
  //       },
  //     "to": obj.token 
  //   }

  //   let postData = JSON.stringify(data);    
  //   let url ="https://fcm.googleapis.com/fcm/send" ;
  //   this.httpClient.post(url,  postData, {
  //     headers: new HttpHeaders()
  //     // put the server key here
  //       .set('Authorization', 'key=	AAAAhL93rUk:APA91bGAdKDGelXIM5L9LFNkfr_5wwVWVx81uQEvL4i2iyFfL1YMD-a55gEJteFMbpJiiJyENWxUylhlAr8KmSgYGzni5EGecqNO_3zpl5Y_E1_LxekXj-q2j1PmczIfP6V4HFvP8kSu')
  //         .set('Content-Type', 'application/json'),
  //    })
  //    .subscribe((response: Response) => {
  //       console.log(response)
  //     },
  //     (error: Response) => {
  //       console.log(error);
  //       console.log("error" + error);
  //     });
  // }





  /****/
  postTokenDetails(token) {
    let userId = localStorage.getItem('FarmerId');
    let obj = {};
    obj["userid"] = userId ? userId:""
    obj["token"] = token;
    obj["source"] = 1;
    obj["usertype"] = ""
    this.httpClient.get(API_PATH.postToken, { params: obj })
    .subscribe(res=> console.log(res));
  }

  // getNotification(data) {
  //   let obj = {};
  //   obj["userid"] = data.userId;
  //   obj["token"] = "d2aS__-o1BgU71mAbIsS9B:APA91bGr_7zCpv-QlXGzO7D6DoLClapj2DVsAeH1EfCRKi3Qs4KdG77_nB-aDkb6UFl4cJY9Z7tLMNn1ryHpMee413vB_0-6HXRohspYkrMTsOiZPRloWdMlxRGQpQQdtkcIFm4O1Yi1";
  //   obj["source"] = 1;
  //   obj["usertype"] = ""
  //   return this.httpClient.get(API_PATH.getToken, { params: obj });
  // }

}