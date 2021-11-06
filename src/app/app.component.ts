import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Secretos', url: 'list', icon: 'mail' },
    { title: 'Nuevo', url: 'create', icon: 'add' },
  ];
  constructor() {}
}
