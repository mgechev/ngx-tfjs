import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToxicityModule, QnAModule} from 'projects/ngx-tfjs/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmojifyPipe } from './emojify.pipe';
import { FirstAnswerPipe } from './first.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EmojifyPipe,
    FirstAnswerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ToxicityModule,
    QnAModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
