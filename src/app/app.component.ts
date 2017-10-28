import { Component } from '@angular/core'
import { Platform, ToastController } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'

import { TabsPage } from '../pages/tabs/tabs'

@Component({
  templateUrl: 'app.html'
})
export class IWeather {
  rootPage: any = TabsPage

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault()
      splashScreen.hide()
    })
  }
}
