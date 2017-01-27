import {Component, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Slides, ToastController, Toast} from 'ionic-angular';
import {Facebook} from "ionic-native";
import {BlueTeeth} from "../../services/blueteeth";
import {Matches} from "../../services/matches";
import firebase from 'firebase';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  @ViewChild(Slides) potsSlides: Slides;
  prog: number = 0.5;

  set progress(p) {
    this.prog = p;
    this.updateSlideCardStyles();
    this.updateSwipeActHighlighterBG();
    this.cdRef.markForCheck();
  }

  tempSlide = [1, 2, 3, 4, 5];
  current = 0;

  manualDismissTimeout: any;
  potentialToast: Toast;
  disableSlides: boolean = false;

  userProfile: any = null;
  slideCardStyles: any = '';
  swipeActHighlighterBG = null;

  constructor(public bt: BlueTeeth, public matches: Matches, public toastCtrl: ToastController,
              public cdRef: ChangeDetectorRef, public domSanity: DomSanitizer) {
  }

  ngOnInit() {
    this.bt.deviceDiscovered$.subscribe((d) => {
      this.matches.potentialFound(d);
    })
  }

  ngAfterViewInit() {
    this.potsSlides.ionSlideWillChange.skip(1).subscribe(() => {
      this.disableSlides = true;
      this.cdRef.markForCheck();
    });

    this.potsSlides.ionSlideProgress.sampleTime(100).subscribe((e) => {
      console.log(e);
      this.progress = e;
      if(e === 0.5) {
        this.disableSlides = false;
      }
      this.cdRef.markForCheck();
    });

    this.potsSlides.ionSlideNextEnd.skip(1).subscribe(() => {
      //console.log('left');
      this.nextPlease(false);
    });
    this.potsSlides.ionSlidePrevEnd.subscribe(() => {
      //console.log('right');
      this.nextPlease(true);
    });
  }

  nextPlease(likedPrev: boolean) {
    this.current++;

    this.progress = 0.5;
    this.potsSlides.slideTo(1, 0, false);

    /*window.clearTimeout(this.manualDismissTimeout);
    if(this.potentialToast) {
      this.potentialToast.dismiss(null, null, {animate: false})
        .then(() => {
          this.toastSwipeConfirmation(likedPrev);
        })
        .catch((e) => console.log(e));
    } else {
      this.toastSwipeConfirmation(likedPrev);
    }*/

    this.cdRef.markForCheck();
  }

  toastSwipeConfirmation(liked) {
    this.potentialToast = this.toastCtrl.create({
      message: 'That was a ' + (liked ? 'Like' : 'Pass'),
      position: 'top',
      cssClass: 'toast-' + (liked ? 'success' : 'fail')
    });
    this.potentialToast.present().then(() => {
      this.manualDismissTimeout = setTimeout(() => {
        this.potentialToast.dismiss(null, null, {animate: false}).catch((e) => console.log(e));
        this.manualDismissTimeout = null;
      }, 1000);
    });
  }

  updateSlideCardStyles() {
    const angle = (0.5 - this.prog) * 20;
    this.slideCardStyles = this.domSanity.bypassSecurityTrustStyle(`
      position: relative;
      transform: rotate3d(0, 0, 1, ${angle}deg);
      -webkit-transform: rotate3d(0, 0, 1, ${angle}deg);
    `);    // -webkit will be allowed someday hopefully
  }

  updateSwipeActHighlighterBG() {
    // not sure if this condition helps in performance
    if(this.prog < 0.25 || this.prog > 0.75 || this.swipeActHighlighterBG !== 'transparent') {
      this.swipeActHighlighterBG = this.prog < 0.25 ? 'rgba(0, 255, 0, ' + (0.45 - this.prog + 0.3) + ')'
        : (this.prog > 0.75 ? 'rgba(255, 0, 0, ' + (this.prog - 0.55 + 0.3) + ')' : 'transparent');
    }
  }

  facebookLogin() {
    Facebook.login(['email']).then((response) => {

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
    }).catch((error) => {
      console.log(error)
    });
  }
}
