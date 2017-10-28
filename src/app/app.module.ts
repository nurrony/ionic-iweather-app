import { HttpModule } from '@angular/http'
import { NgModule, ErrorHandler } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { IonicStorageModule } from '@ionic/storage'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'

import { Network } from '@ionic-native/network'
import { Geolocation } from '@ionic-native/geolocation'

import { IWeather } from './app.component'
import { TabsPageModule } from '../pages/tabs/tabs.module'
import { HomePageModule } from '../pages/home/home.module'
import { AboutPageModule } from '../pages/about/about.module'
import { SettingsPageModule } from '../pages/settings/settings.module'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

import { PersistanceProvider, WeatherProvider } from './../providers'

@NgModule({
  declarations: [IWeather],
  imports: [
    BrowserModule,
    TabsPageModule,
    HttpModule,
    AboutPageModule,
    HomePageModule,
    SettingsPageModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(IWeather)
  ],
  bootstrap: [IonicApp],
  entryComponents: [IWeather],
  providers: [
    PersistanceProvider,
    WeatherProvider,
    StatusBar,
    SplashScreen,
    Geolocation,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
