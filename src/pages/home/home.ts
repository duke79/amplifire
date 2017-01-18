import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';
import {BluetoothSerial, Facebook} from "ionic-native";
import {BlueTeeth} from "../../services/blueteeth";
import {Matches} from "../../services/matches";
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public bt: BlueTeeth, public matches: Matches) {
  }

  ngOnInit() {
    this.bt.deviceDiscovered$.subscribe((d) => {
      this.matches.potentialFound(d);

    })
  }

  userProfile: any = null;
  facebookLogin(){
    Facebook.login(['email']).then( (response) => {
      let facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
          console.log("Firebase success: " + JSON.stringify(success));
          this.userProfile = success;
        })
        .catch((error) => {
          console.log("Firebase failure: " + JSON.stringify(error));
        });
    }).catch((error) => { console.log(error) });
  }
}
