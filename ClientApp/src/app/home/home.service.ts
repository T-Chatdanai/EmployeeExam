import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Homeservice {
  constructor(private httpClient: HttpClient) { }

  getEmpList(username: any, password: any) {
    // const headersObject = new HttpHeaders();
    // headersObject.append('Content-Type', 'application/json');
    // headersObject.append('Authorization', 'Basic ' + btoa(username + ':' + password));

    // const httpOptions = {
    //   headers: headersObject
    // };
    return this.httpClient.get('https://dummy-api.cm.edu/employees', {
      headers: new HttpHeaders({ 'Authorization': 'Basic ' + btoa(username + ':' + password) })
    });
  }

  login(username: any, password: any) {
    return this.httpClient.get('https://dummy-api.cm.edu/employees', {
      headers: new HttpHeaders({
        'Authorization': 'Basic ' + btoa(username + ':' + password)
      })
    });
  }
}

