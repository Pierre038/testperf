import { IdUploadModule } from './components/id-upload/id-upload.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxsModule } from 'ngxs';
import { UserState } from './states/user/user.state';
import { IdentificationState } from './states/identification/identification.state';
import { UserService } from './services/user.service';
import { UserMapper } from './mappers/user.mapper';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IdUploadModule,
    HttpClientModule,
    NgxsModule.forRoot([UserState, IdentificationState]),
  ],
  providers:  [UserService, UserMapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
