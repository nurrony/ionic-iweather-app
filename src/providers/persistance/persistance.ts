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
      const unitPromise = this.storage.get('units')

      return Promise.all([
        locationPromise,
        geoLocationPromise,
        unitPromise
      ]).then(([weatherLocation, geoLocation, units]) => {
        const location = (weatherLocation && JSON.parse(weatherLocation)) || { state: 'Bangladesh', city: 'Chittagong' }
        geoLocation = geoLocation || false
        units = units || 'metric'
        return { location, geoLocation, units }
      })
    })
  }

  setLocation(location): Promise<boolean> {
    return this.storage.set('location', JSON.stringify(location))
  }

  setGeoLocationPreferance(geoLocation): Promise<boolean> {
    return this.storage.set('geoLocation', geoLocation)
  }

  setUnitPreferance(units: string): Promise<boolean> {
    return this.storage.set('units', units)
  }
}
