import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxSentimentModule } from 'projects/ngx-ml/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmojifyPipe } from './emojify.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EmojifyPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxSentimentModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
