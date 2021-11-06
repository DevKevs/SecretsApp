import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  nombre: any;
  fecha: any;
  desc: any;
  obj: any;
  public base64Image: string;
  estado = '';
  audio: any;

  //datetime
  customYearValues = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  constructor(private database: DatabaseService, private camera: Camera, private sanitizer: DomSanitizer) {
    this.database.createDatabase().then(() =>'ok');
   }

  ngOnInit() {
  }
  addSecret(){
    if (!this.nombre.length || !this.fecha.length || !this.desc.length) {
      alert('Rellene los campos');
      return;
    }
    // eslint-disable-next-line no-var
    this.obj = {
      nombre: this.nombre,
      fecha: this.fecha,
      descripcion: this.desc,
      foto: this.base64Image,
      audio: this.audio,
    };
    this.database.addSecret(this.obj).then((data) =>{
      this.nombre = '';
      this.fecha = '';
      this.desc = '';
      this.base64Image = '';
      this.audio = null;
      alert(data);
    });
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });
  }
  loadPicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      targetHeight: 1024,
      targetWidth: 1024,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then(imageData => {
     this.base64Image = `data:image/jpeg;base64,${imageData}`;
    }, (err) => {
     console.log(err);
    });
  }

  //grabar methods
  grabar(){
    this.eliminar();
    VoiceRecorder.canDeviceVoiceRecord();
    VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => {
      VoiceRecorder.hasAudioRecordingPermission().then((results: GenericResponse) => {
        if (results.value) {
          VoiceRecorder.startRecording();
          this.estado = 'Grabando...';
          document.getElementById('record').style.color = 'red';
        }
      });
    });
  }
  detener(){
    VoiceRecorder.stopRecording().then((result: RecordingData) => {
      this.audio = result.value;
      this.estado = 'Grabado!';
      document.getElementById('record').style.color = 'green';
    }).catch(error => console.log(error));
  }
  getAudioContent(audio): SafeUrl {
    this.audio = audio;
    if (this.audio.includes('data')) {
      return this.sanitizer.bypassSecurityTrustUrl(this.audio);
    } else {
      this.audio = 'data:audio/webm;codecs=opus;base64,'+this.audio;
      return this.sanitizer.bypassSecurityTrustUrl(this.audio);
    }
  }
  eliminar(){
    this.estado = '';
    this.audio = null;
    VoiceRecorder.stopRecording();
  }
}
