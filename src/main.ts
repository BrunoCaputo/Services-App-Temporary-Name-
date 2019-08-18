import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import 'hammerjs';

declare var gapi;

if (environment.production) {
  enableProdMode();
}

gapi.load('client:auth2', () => gapi.client.init(environment.google));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));