import { PipeTransform, Pipe } from '@angular/core';
import { Value, Label } from 'projects/ngx-sentiment/src/public-api';

const labels: {[label in Label]: string} = {
  identity_attack: '😡',
  insult: '🤬',
  obscene: '🤐',
  sexual_explicit: '😦',
  toxicity: '😒',
  threat: '⛔️'
};

@Pipe({
  name: 'emojify',
})
export class EmojifyPipe implements PipeTransform {
  transform(value: Value) {
    console.log(value);
    if (!value) {
      return '😑';
    }
    if (!value.match) {
      return '😊';
    }
    return labels[value.label];
  }
}
