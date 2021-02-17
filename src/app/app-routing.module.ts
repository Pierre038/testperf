import { HiddenCaptureComponent } from './components/hidden-capture/hidden-capture.component';
import { IdUploadComponent } from './components/id-upload/id-upload.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'upload', component: IdUploadComponent },
  { path: 'hiddenupload', component: HiddenCaptureComponent },
  { path: '',   redirectTo: '/upload', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
