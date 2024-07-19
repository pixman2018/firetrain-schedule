// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: require('../../package.json').name,
  appVersion: require('../../package.json').version + '-dev',
  firebase: { 
    "projectId": "workout-plan-faeb9", 
    "appId": "1:173899062442:web:f1a3ca25f01eac329c44d3", 
    "databaseURL": "https://workout-plan-faeb9-default-rtdb.europe-west1.firebasedatabase.app", 
    "storageBucket": "workout-plan-faeb9.appspot.com", 
    "apiKey": "AIzaSyCfnHRZZh1lGG5Yg7KN13hvZuQliyp9CP8", 
    "authDomain": "workout-plan-faeb9.firebaseapp.com", 
    "messagingSenderId": "173899062442" 
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
