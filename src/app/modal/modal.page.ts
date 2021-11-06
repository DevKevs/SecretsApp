import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() entity: any;
  constructor(public modalController: ModalController, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }
  getAudioContent(audio): SafeUrl {
    this.entity.audio = audio;
    if ( this.entity.audio.includes('data')) {
      return this.sanitizer.bypassSecurityTrustUrl( this.entity.audio);
    } else {
      this.entity.audio = 'data:audio/webm;codecs=opus;base64,'+ this.entity.audio;
      return this.sanitizer.bypassSecurityTrustUrl( this.entity.audio);
    }
  }
}
