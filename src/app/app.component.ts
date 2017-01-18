import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import firebase from 'firebase';

import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform) {
    firebase.initializeApp({
      apiKey: "AIzaSyCcX4tZmgUU-oUhgnO-ptULnsnFDyPfpJA",
      authDomain: "oneup-ccb99.firebaseapp.com",
      databaseURL: "https://oneup-ccb99.firebaseio.com",
      storageBucket: "oneup-ccb99.appspot.com",
      messagingSenderId: "955854162962"
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}
