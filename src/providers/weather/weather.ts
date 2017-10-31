import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'

import { Geolocation } from '@ionic-native/geolocation'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class WeatherProvider {
  API_KEY = '86766aaad5f7075ae5ea65c54fd2cda7'
  BASE_URL = `http://api.openweathermap.org/data/2.5/weather?lang=en&appid=${this.API_KEY}`
  latitude: number
  longitude: number
  units = 'metric'

  constructor(public http: Http, private geoLocationProvider: Geolocation) {}

  getLatitudeAndLogitude(): Promise<any> {
    return this.geoLocationProvider.getCurrentPosition({ timeout: 10000, enableHighAccuracy: true }).then(position => {
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude
    })
  }

  getWeather(geoLocationPreference = false, location = {}, units = 'metric'): Promise<Response> {
    return geoLocationPreference ? this.getWeatherByGeoLocation(units) : this.getWeatherByLocation(location, units)
  }

  getWeatherByGeoLocation(units): Promise<any> {
    return this.getLatitudeAndLogitude().then(response => {
      const url = `${this.BASE_URL}&units=${units}&lat=${this.latitude}&lon=${this.longitude}`
      return this.http.get(url).toPromise().then((res: any) => res.json())
    })
  }

  getWeatherByLocation(location, units): Promise<Response> {
    const url = `${this.BASE_URL}&units=${units}&q=${location.city}`
    return this.http
      .get(url)
      .toPromise()
      .then(res => res.json())
  }
}
