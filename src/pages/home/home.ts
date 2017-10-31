import { Component } from '@angular/core'

import { ToastController, LoadingController, AlertController, Platform, NavController, IonicPage } from 'ionic-angular'
import { Network } from '@ionic-native/network'

import { Subscription } from 'rxjs/Subscription'

import { WeatherProvider, PersistanceProvider } from './../../providers'

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  settings: any
  disConnectionSubscription: Subscription
  connectionSubscription: Subscription
  weatherInfo: any

  constructor(
    public platform: Platform,
    public navCtrl: NavController,
    private weatherProvider: WeatherProvider,
    private alertCtrl: AlertController,
    private network: Network,
    private toastCtrl: ToastController,
    private persistanceProvider: PersistanceProvider,
    private loadingCtrl: LoadingController
  ) {}

  getWeather(): void {
    const loading = this.loadingCtrl.create({
      content: 'Fetching weather...',
      spinner: 'dots'
    })
    loading.present().then(() => {
      this.weatherProvider
        .getWeather(this.settings.geoLocation, this.settings.location, this.settings.units)
        .then(weather => {
          this.weatherInfo = weather
          this.weatherInfo.weather = this.weatherInfo.weather.pop()
          loading.dismiss()
        })
        .catch(error => {
          loading.dismiss()
          this.errorHandler(error)
        })
    })
  }

  /**
   * Lifecyle hook:
   * It's fired when entering a page, before it becomes the active one.
   * Use it for tasks you want to do every time you enter in the view
   */
  ionViewWillEnter() {
    this.persistanceProvider
      .getSettings()
      .then(setttings => {
        this.settings = setttings
        this.getWeather()
        this.watchNetworkConnectivity()
        this.watchNetworkDisconnectivity()
      })
      .catch(error => this.errorHandler(error))
  }

  getTempUnit() {
    return this.settings.units === 'metric' ? '&#8451;' : '&#8457;'
  }

  getSpeedUnit() {
    return this.settings.units === 'metric' ? 'm/s' : 'mi/s'
  }

  /**
   * Watches for network connection
   */
  watchNetworkConnectivity() {
    this.connectionSubscription = this.network.onConnect().subscribe(() => {
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.getWeather()
      }, 0.5 * 1e3)
    })
  }

  /**
   * Watches for network disconnection
   */
  watchNetworkDisconnectivity() {
    this.disConnectionSubscription = this.network.onDisconnect().subscribe(() => {
      this.showWarning('Please connect to internet to enjoy awesome wather updates!!')
    })
  }

  showWarning(message: string = 'nothing'): void {
    const alert = this.alertCtrl.create({
      title: 'No Internet',
      message,
      buttons: [
        'Ok',
        {
          role: 'danger',
          text: 'Exit',
          handler: () => this.platform.exitApp()
        }
      ]
    })
    alert.present()
  }

  errorHandler(error: Error) {
    this.showTostMessage(error.message || 'Something went wrong!!')
  }

  showTostMessage(message: string = 'Sorry for no message') {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000,
      showCloseButton: true,
      closeButtonText: 'Ok',
      position: 'bottom'
    })
    toast.present()
    return true
  }

  getLocalTime(timestamp) {
    const d = new Date(timestamp * 1000) // Convert the passed timestamp to milliseconds
    const fullHour = d.getHours()
    let hour = fullHour
    const min = ('0' + d.getMinutes()).slice(-2) // Add leading 0.
    let am_pm = 'AM'

    if (fullHour > 12) {
      hour = fullHour - 12
      am_pm = 'PM'
    } else if (fullHour === 12) {
      hour = 12
      am_pm = 'PM'
    } else if (fullHour == 0) {
      hour = 12
    }

    // 8:35 AM
    return hour + ':' + min + ' ' + am_pm
  }

  /**
   * Lifecycle hook:
   * Fired when you leave a page, before it stops being the active one.
   * Use it for things you need to run every time you are leaving a page
   */
  ionViewWillLeave() {
    this.connectionSubscription.unsubscribe()
    this.disConnectionSubscription.unsubscribe()
  }
}
