import { Injectable } from '@angular/core';
import { Hero } from '../types/hero';
import { Observable, of} from 'rxjs';
import { catchError, map, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from '../../../core/services/message/message.service';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching ${term}`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((resHero: Hero) => this.log(`added hero id=${resHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  updateHero (hero: Hero): Observable<any> {

    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`update hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: Number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap( _ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }
}
