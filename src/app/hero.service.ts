import { Injectable } from '@angular/core'
import { Http, Headers } from '@angular/http'

import 'rxjs/add/operator/toPromise'

import { Hero } from './hero'

@Injectable()
export class HeroService {
  private heroesUrl = 'app/heroes' // URL to web api

  constructor(private http: Http) { }

  getHeros(): Promise<Hero[]> {
    return this.http
      .get(this.heroesUrl)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError)
  }

  getHero(id: number): Promise<Hero> {
    return this.getHeros()
      .then(
        heroes => heroes.filter(hero => hero.id === id)[0]
      )
  }

  save(hero: Hero): Promise<Hero> {
    if (hero.id) {
      return this.put(hero)
    }
    return this.post(hero)
  }

  delete(hero: Hero): Promise<Hero> {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let url = `${this.heroesUrl}/${hero.id}`

    return this.http
      .delete(url, { headers: headers })
      .toPromise()
      .then(() => hero) // determine if the response has the hero with full data
      .catch(this.handleError)
  }


  // Add new Hero
  private post(hero: Hero): Promise<Hero> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    })

    return this.http
      .post(this.heroesUrl, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError)
  }

  // Update existing Hero
  private put(hero: Hero): Promise<Hero> {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let url = `${this.heroesUrl}/${hero.id}`

    return this.http
      .put(url, JSON.stringify(hero), { headers: headers })
      .toPromise()
      .then(() => hero)
      .catch(this.handleError)
  }

  handleError(error: any) {
    // here, we only log the error to the console, we can handle this better for the User
    console.error('An error occurred with the Hero Service', error)
    return Promise.reject(error.message || error)
  }
}