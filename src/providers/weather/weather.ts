import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'

import { Geolocation } from '@ionic-native/geolocation'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class WeatherProvider {
  API_KEY = '8fa70412c08314f4'
  BASE_URL = `http://api.wunderground.com/api/${this.API_KEY}`
  latitude: number
  longitude: number

  constructor(public http: Http, private geoLocationProvider: Geolocation) {}

  getLatitudeAndLogitude(): Promise<any> {
    return this.geoLocationProvider.getCurrentPosition({ timeout: 10000, enableHighAccuracy: false }).then(position => {
      this.latitude = position.coords.latitude
      this.longitude = position.coords.longitude
    })
  }

  getWeather(geoLocationPreference = false, location = {}): Promise<Response> {
    return geoLocationPreference ? this.getWeatherByGeoLocation() : this.getWeatherByLocation(location)
  }

  getWeatherByGeoLocation(): Promise<any> {
    return this.getLatitudeAndLogitude().then(response => {
      const url = `${this.BASE_URL}/geolookup/q/${this.latitude},${this.longitude}.json`
      return this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          const response = res.json()
          const city = response.location.city.split(' ').join('_')
          const state = response.location.state || response.location.country_name.split(' ').join('_')
          return this.getWeatherByLocation({ city, state })
        })
    })
  }

  getWeatherByLocation(location): Promise<Response> {
    const url = `${this.BASE_URL}/conditions/q/${location.state}/${location.city}.json`
    return this.http
      .get(url)
      .toPromise()
      .then(res => {
        const weatherData = res.json()
        const multiLocation = weatherData.response
        if (multiLocation.results) {
          location = multiLocation.results.pop()
          return this.getWeatherByParams(location.zmw)
        } else {
          return weatherData
        }
      })
  }

  getWeatherByParams(zmw): Promise<any> {
    const url = `${this.BASE_URL}/conditions/q/zmw:${zmw}.json`
    return this.http
      .get(url)
      .toPromise()
      .then(response => {
        const weatherData = response.json()
        console.log('Params', weatherData)
        return weatherData
      })
  }
}
