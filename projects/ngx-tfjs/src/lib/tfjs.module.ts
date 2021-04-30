import { NgModule } from '@angular/core';
import { ToxicityModule } from './toxicity/toxicity.module';
import { QnAModule } from './qna/qna.module';

@NgModule({
  imports: [ToxicityModule, QnAModule],
  exports: [ToxicityModule, QnAModule],
})
export class TFJSModule {}
