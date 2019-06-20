import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Pelicula } from './pelicula';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "http://192.168.1.53:8080/peliculas";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  buscarPelicula(id): Observable<Pelicula> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Pelicula>(url).pipe(
      tap(_ => console.log(`pelicula encontrada id=${id}`)),
      catchError(this.handleError<Pelicula>(`getProduct id=${id}`))
    );
  }

  listaPeliculas(): Observable<Pelicula[]> {
    const url = apiUrl+'/getAll';
    return this.http.get<Pelicula[]>(url).pipe(
      tap(_ => console.log(`Lista de peliculas`)),
      catchError(this.handleError<Pelicula[]>(`listaPeliculas`))
    );
  }
  
  añadirPelicula (pelicula): Observable<Pelicula> {
    const url = `${apiUrl}/add`
    return this.http.post<Pelicula>(url, pelicula, httpOptions).pipe(
      tap((pelicula: Pelicula) => console.log(`pelicula añadida w/ id=${pelicula._id}`)),
      catchError(this.handleError<Pelicula>('añadirPelicula'))
    );
  }
  
  editarPelicula (id, pelicula): Observable<any> {
    const url = `${apiUrl}/editar/${id}`;
    return this.http.put(url, pelicula, httpOptions).pipe(
      tap(_ => console.log(`pelicula editada id=${id}`)),
      catchError(this.handleError<any>('editarPelicula'))
    );
  }
  
  eliminarPelicula (id): Observable<Pelicula> {
    const url = `${apiUrl}/delete/${id}`;
  
    return this.http.delete<Pelicula>(url, httpOptions).pipe(
      tap(_ => console.log(`Pelicula eliminada id=${id}`)),
      catchError(this.handleError<Pelicula>('eliminarPelicula'))
    );
  }
}
