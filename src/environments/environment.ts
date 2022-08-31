// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


export const environment = {
  production: true,
  baseUrl: 'https://behtarzindagi.in/',  
  //baseApiUrl: 'https://behtarzindagi.in/BZFarmerApp_Test/', //test server
    baseApiUrl: 'https://behtarzindagi.in/BZFarmerApp_Live/', // live server 
   loginUrl: 'https://app.astrolive.online/bz/',

  firebase: {
    apiKey: "AIzaSyDmhdnkR8bVZfzaJ2vlCNO8GyDdwbV_3eM",
    authDomain: "web-push-notification-d9f49.firebaseapp.com",
    databaseURL: "https://web-push-notification-d9f49-default-rtdb.firebaseio.com",
    projectId: "web-push-notification-d9f49",
    storageBucket: "web-push-notification-d9f49.appspot.com",
    messagingSenderId: "570147974473",
    appId: "1:570147974473:web:6fc60dc34915dec5893e98",
    measurementId: "G-2LVFSF2LPE"
  }
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
