import { NgModule } from '@angular/core';
import { SentimentPipe } from './ngx-sentiment.pipe';
import { SentimentService } from './ngx-sentiment.service';



@NgModule({
  declarations: [SentimentPipe],
  providers: [SentimentService],
  exports: [SentimentPipe]
})
export class NgxSentimentModule { }
