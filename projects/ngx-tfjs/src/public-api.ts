/*
 * Public API Surface of ngx-sentiment
 */

export { Label, Prediction, ToxicityService } from './lib/toxicity/toxicity.service';
export { ToxicityPipe, Value } from './lib/toxicity/toxicity.pipe';
export { ToxicityModule } from './lib/toxicity/toxicity.module';

export { Prediction as QnAPrediction, QnAService } from './lib/qna/qna.service';
export { QnAPipe, Value as QnAValue } from './lib/qna/qna.pipe';
export { QnAModule } from './lib/qna/qna.module';
