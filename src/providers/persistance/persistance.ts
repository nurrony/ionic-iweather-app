import { Injectable } from '@angular/core'
import { Storage } from '@ionic/storage'
import 'rxjs/add/operator/map'

@Injectable()
export class PersistanceProvider {
  constructor(public storage: Storage) {
    console.log('Hello PersistanceProvider Provider')
  }

  getSettings(): Promise<any> {
    return this.storage.ready().then(() => {
      const locationPromise = this.storage.get('location')
      const geoLocationPromise = this.storage.get('geoLocation')

      return Promise.all([locationPromise, geoLocationPromise]).then(([weatherLocation, geoLocation]) => {
        const location = (weatherLocation && JSON.parse(weatherLocation)) || { state: 'Bangladesh', city: 'Chittagong' }
        geoLocation = geoLocation || false
        return { location, geoLocation }
      })
    })
  }

  setLocation(location): Promise<boolean> {
    return this.storage.set('location', JSON.stringify(location))
  }

  setGeoLocationPreferance(geoLocation): Promise<boolean> {
    return this.storage.set('geoLocation', geoLocation)
  }
}
