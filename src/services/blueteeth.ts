/**
 * Created by dabalyanRemote on 11-Jan-17.
 */

import {Injectable} from "@angular/core";
import {BluetoothSerial} from "ionic-native";
import {Subject} from "rxjs";

@Injectable()
export class BlueTeeth {
  keepLooking: boolean = false; // in the background
  isLooking: boolean = false;
  deviceDiscovered$ = new Subject();

  startDiscovery() {
    BluetoothSerial.isEnabled()
      .then(() => {
        this.beDiscoverableAndDiscover()
      })
      .catch(() => {
        BluetoothSerial.enable().then(() => {
          this.beDiscoverableAndDiscover();
        });
      });
  }

  beDiscoverableAndDiscover() {
    this.setDiscoveryListener();
    this.setDiscoverable();
    this.discover();
  }

  discover() {
    BluetoothSerial.discoverUnpaired().then(() => {
      if (this.keepLooking) {
        this.discover();
      }
      console.log('Done Discovery');
    })
  }

  keepDiscovering() {
    this.keepLooking = true;
    this.discover();
  }

  setDiscoverable() {
    // TODO: set discoverabel, again and again if application is active or keepLooking is true
    BluetoothSerial.setDiscoverable(this.keepLooking ? 1800 : 900);
    console.log('setDiscoverable');
  }

  setDiscoveryListener() {
    BluetoothSerial.setDeviceDiscoveredListener().subscribe(this.onDiscovery.bind(this));
    console.log('setDiscoveryListener');
  }

  onDiscovery(device) {
    console.log('found one', device);
    this.deviceDiscovered$.next(device);
  }
}
