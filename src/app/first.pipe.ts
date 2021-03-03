import { Pipe, PipeTransform } from "@angular/core";
import { QnAPrediction } from "projects/ngx-tfjs/src/public-api";

@Pipe({
  name: 'first'
})
export class FirstAnswerPipe implements PipeTransform {
  transform(predictions: QnAPrediction[]|null) {
    if (predictions === null) {
      return '';
    }
    if (!predictions.length) {
      return `I don't know.`;
    }
    return predictions.pop()?.text;
  }
}
