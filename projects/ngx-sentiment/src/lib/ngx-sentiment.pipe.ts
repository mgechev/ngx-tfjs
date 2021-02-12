import { ChangeDetectorRef, Pipe, PipeTransform } from '@angular/core';
import { SentimentService, Prediction } from './ngx-sentiment.service';

const enum State {
  Unavailable,
  Initializing,
  Ready,
}

export type Value = Prediction[] | null;

@Pipe({
  name: 'sentiment',
  pure: false,
})
export class SentimentPipe implements PipeTransform {
  private _latestValue: Promise<Value> = Promise.resolve(null);
  private _latestInput: string | undefined = undefined;
  private _state = State.Unavailable;
  private _lastThreshold = 0.9;

  constructor(
    private _model: SentimentService,
    private _cd: ChangeDetectorRef
  ) {}

  transform(input: string, threshold: number = 0.9): Promise<Value> {
    if (threshold !== this._lastThreshold) {
      this._state = State.Unavailable;
    }
    if (this._state === State.Initializing) {
      return this._latestValue;
    }
    if (this._state === State.Unavailable) {
      this._lastThreshold = threshold;
      this._state = State.Initializing;
      this._model.setThreshold(threshold).then(() => {
        this._state = State.Ready;
        this._cd.detectChanges();
      });
      return this._latestValue;
    }
    if (input === this._latestInput) {
      return this._latestValue;
    }
    this._latestInput = input;
    return this._latestValue = this._model.classify([input]);
  }
}
