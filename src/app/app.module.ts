import { importProvidersFrom, LOCALE_ID, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { provideHttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { AppComponent } from './app.component';
// ionic
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// fireabse
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';

import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { ExampleModule } from './example/example.module';
import { SharedModule } from './shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import {provideNgxWebstorage, withLocalStorage, withNgxWebstorageConfig, withSessionStorage} from 'ngx-webstorage';

registerLocaleData(localeDe);


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ innerHTMLTemplatesEnabled: true }),
    AppRoutingModule,
    ExampleModule,
    SharedModule,
    ReactiveFormsModule,

  ],
  providers: [
    provideNgxWebstorage(
    //   withNgxWebstorageConfig({ separator: ':', caseSensitive: true }),
		// withLocalStorage(),
		// withSessionStorage()
    ),
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {provide: LOCALE_ID, useValue: 'de'},
    {provide: LocationStrategy, useClass: HashLocationStrategy  }, // PathLocationStrategy
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    // provideAnalytics(() => getAnalytics()),
    // ScreenTrackingService,
    // UserTrackingService,
    //     provideAppCheck(() => {
    //   // TODO get a reCAPTCHA Enterprise here https://console.cloud.google.com/security/recaptcha?project=_
    //   const provider = new ReCaptchaEnterpriseProvider(/* reCAPTCHA Enterprise site key */);
    //   // return initializeAppCheck(undefined, { provider, isTokenAutoRefreshEnabled: true });
    // }),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    // provideFunctions(() => getFunctions()),
    // provideMessaging(() => getMessaging()),
    // providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    // provideRemoteConfig(() => getRemoteConfig()),
    // provideVertexAI(() => getVertexAI()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
