import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { QnAService, Prediction } from './qna.service';

const enum State {
  Unavailable,
  Initializing,
  Ready,
}

export type Value = Prediction[] | null;

@Pipe({
  name: 'qna',
  pure: false,
})
export class QnAPipe implements PipeTransform, OnDestroy {
  private _latestValue = new BehaviorSubject<Value>(null);
  private _latestPassage: string | undefined = undefined;
  private _latestQuestion: string | undefined = undefined;
  private _state = State.Unavailable;
  private _timeout = false;

  constructor(private _model: QnAService) {}

  transform(passage: string, question: string): Observable<Value> {
    if (this._timeout) {
      return this._latestValue;
    }
    this._timeout = true;
    setTimeout(() => {
      this._predict(passage, question);
      this._timeout = false;
    }, 1000);
    return this._latestValue;
  }

  ngOnDestroy() {
    this._model.ngOnDestroy();
  }

  private _predict(passage: string, question: string) {
    if (this._state === State.Initializing) {
      return;
    }
    if (this._state === State.Unavailable) {
      this._state = State.Initializing;
      this._model.init().then(() => {
        this._state = State.Ready;
      });
      return;
    }
    if (passage === this._latestPassage && question === this._latestQuestion) {
      return;
    }
    this._latestPassage = passage;
    this._latestQuestion = question;
    this._model.findAnswers(passage, question).then((val) => {
      this._latestValue.next(val);
    });
  }
}
