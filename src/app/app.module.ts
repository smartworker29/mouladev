import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CommonModule, LocationStrategy, HashLocationStrategy} from '@angular/common';
import {Ng2DeviceDetectorModule} from 'ng2-device-detector';

import {CoreModule} from './core/core.modules';
import {AuthModule} from './auth/auth.module';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing';
import {TermsOfUseContent} from './home/terms-of-use/terms-of-use.component';
import 'hammerjs';
import {MdButtonModule, MdIconModule, MdCheckboxModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    TermsOfUseContent
      ],
  imports: [
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    Ng2DeviceDetectorModule.forRoot(),
    CommonModule,
    CoreModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    AuthModule
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }
  ],
  entryComponents: [TermsOfUseContent],
  bootstrap: [AppComponent]
})
export class AppModule { }
