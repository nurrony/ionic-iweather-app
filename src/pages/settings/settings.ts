import { ToastController, IonicPage, NavController, NavParams } from 'ionic-angular'

import { HomePage } from './../index'
import { Component } from '@angular/core'
import { PersistanceProvider } from '../../providers/persistance/persistance'

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  city: string
  state: string
  geoLocation: boolean

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private persistanceProvider: PersistanceProvider,
    private toastCtrl: ToastController
  ) {}

  loadDataFromStorage() {
    this.persistanceProvider
      .getSettings()
      .then(({ location, geoLocation }) => {
        this.city = location.city
        this.state = location.state
        this.geoLocation = geoLocation
      })
      .catch(error => this.errorHandler(error))
  }

  saveLocationInformation() {
    if ((!this.city || !this.state) && (this.city === '' || this.state === '')) {
      return this.showToast('All fields are required')
    }

    const location = {
      city: this.city,
      state: this.state
    }

    this.persistanceProvider
      .setLocation(location)
      .then(saved => {
        this.showToast('Location preference saved successfully.')
        this.navCtrl.setRoot(HomePage)
      })
      .catch(error => this.errorHandler(error))
  }

  saveChoice() {
    this.persistanceProvider
      .setGeoLocationPreferance(this.geoLocation)
      .then(saved => {
        this.geoLocation
        return (
          this.geoLocation &&
          this.showToast('Location preference saved successfully.') &&
          this.navCtrl.setRoot(HomePage)
        )
      })
      .catch(error => this.errorHandler(error))
  }

  showToast(message: string = 'Sorry for no message'): boolean {
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

  errorHandler(error: Error) {
    this.showToast(error.message || 'Something went wrong!!')
  }

  ionViewDidLoad() {
    this.loadDataFromStorage()
  }
}
