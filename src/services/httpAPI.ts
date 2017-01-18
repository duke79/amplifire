/**
 * Created by dabalyanRemote on 11-Jan-17.
 */

import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class HttpAPI {
  constructor(private http: Http) {
  }

  public request() {
    return Observable.of(null);
  }
}
