import { PipeTransform, Pipe } from '@angular/core';
import { Value } from 'projects/ngx-sentiment/src/public-api';

const labels = [
  '😊',
  '😒',
  '🤐',
  '😦',
  '😡',
  '🤬',
  '⛔️'
];

@Pipe({
  name: 'emojify',
})
export class EmojifyPipe implements PipeTransform {
  transform(value: Value) {
    if (!value) {
      return '😑';
    }
    const matches = value.reduce((total, a) => a.match ? ++total : total, 0);
    if (!matches) {
      return '😊';
    }
    return labels[matches];
  }
}
