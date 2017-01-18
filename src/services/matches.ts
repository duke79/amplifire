/**
 * Created by dabalyanRemote on 11-Jan-17.
 */

import {Injectable} from "@angular/core";
import {BlueTeeth} from "./blueteeth";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class Matches {
  tempPots = [];
  tempStore: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private ble: BlueTeeth) {
  }

  potentialFound(po) {
    console.log('exists', this.tempPots.find(p => p.address == po.address));

    if (!this.tempPots.find(p => p.address == po.address)) {
      this.tempPots.push(po);
      this.tempStore.next(this.tempPots);
    }
    // TODO: save to localDb and fireBase
    // TODO: on app startup sync the database, if user is returning after uninstall/ relogin
  }

  fetchPotentials() {
    return this.tempStore;
  }

  fetchMatches() {

  }
}
