import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToxicityService, Prediction } from './toxicity.service';

const enum State {
  Unavailable,
  Initializing,
  Ready,
}

export type Value = Prediction[] | null;

@Pipe({
  name: 'toxicity',
  pure: false,
})
export class ToxicityPipe implements PipeTransform, OnDestroy {
  private _latestValue = new BehaviorSubject<Value>(null);
  private _latestInput: string | undefined = undefined;
  private _state = State.Unavailable;
  private _lastThreshold = 0.9;
  private _timeout = false;

  constructor(private _model: ToxicityService) {}

  transform(input: string, threshold: number = 0.9): Observable<Value> {
    if (this._timeout) {
      return this._latestValue;
    }
    this._timeout = true;
    setTimeout(() => {
      this._predict(input, threshold);
      this._timeout = false;
    }, 1000);
    return this._latestValue;
  }

  ngOnDestroy() {
    this._model.ngOnDestroy();
  }

  private _predict(input: string, threshold: number) {
    if (threshold !== this._lastThreshold) {
      this._state = State.Unavailable;
    }
    if (this._state === State.Initializing) {
      return;
    }
    if (this._state === State.Unavailable) {
      this._lastThreshold = threshold;
      this._state = State.Initializing;
      this._model.init(threshold).then(() => {
        this._state = State.Ready;
      });
      return;
    }
    if (input === this._latestInput) {
      return;
    }
    this._latestInput = input;
    this._model.classify([input]).then((val) => {
      this._latestValue.next(val);
    });
  }
}
