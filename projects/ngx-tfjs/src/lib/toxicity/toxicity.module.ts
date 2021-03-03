import { NgModule } from '@angular/core';
import { ToxicityPipe } from './toxicity.pipe';
import { ToxicityService } from './toxicity.service';

@NgModule({
  declarations: [ToxicityPipe],
  providers: [ToxicityService],
  exports: [ToxicityPipe]
})
export class ToxicityModule { }
