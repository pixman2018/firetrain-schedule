import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{
    provide: RouteReuseStrategy, useClass: IonicRouteStrategy
  },
  provideFirebaseApp(() => initializeApp({ 
    "projectId": "workout-plan-faeb9", 
    "appId": "1:173899062442:web:f1a3ca25f01eac329c44d3", 
    "databaseURL": "https://workout-plan-faeb9-default-rtdb.europe-west1.firebasedatabase.app", 
    "storageBucket": "workout-plan-faeb9.appspot.com", 
    "apiKey": "AIzaSyCfnHRZZh1lGG5Yg7KN13hvZuQliyp9CP8", 
    "authDomain": "workout-plan-faeb9.firebaseapp.com", 
    "messagingSenderId": "173899062442" 
  })),
  provideAuth(() => getAuth()),
  // provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    UserTrackingService,
  //     provideAppCheck(() => {
  //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
  //   const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
  //   // return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
  // }), 
  provideFirestore(() => getFirestore()),
  provideDatabase(() => getDatabase()),
  provideFunctions(() => getFunctions()),
  provideMessaging(() => getMessaging()),
  providePerformance(() => getPerformance()),
  provideStorage(() => getStorage()),
  provideRemoteConfig(() => getRemoteConfig()),
  provideVertexAI(() => getVertexAI()
  )],
  bootstrap: [AppComponent],
})
export class AppModule { }
