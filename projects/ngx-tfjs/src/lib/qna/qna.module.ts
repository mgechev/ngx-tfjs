import { NgModule } from '@angular/core';
import { QnAPipe } from './qna.pipe';
import { QnAService } from './qna.service';

@NgModule({
  declarations: [QnAPipe],
  providers: [QnAService],
  exports: [QnAPipe]
})
export class QnAModule { }
