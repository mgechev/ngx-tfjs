import { Injectable, OnDestroy } from '@angular/core';
import { MessageBus } from '../message-bus';

export interface Prediction {
  text: string;
  startIndex: number;
  endIndex: number;
  score: number;
}


const enum PayloadType {
  Init = 'init',
  Classify = 'classify',
  Classified = 'classified'
}

const workerScript = `
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/qna');

let model = null;
self.addEventListener('message', (e) => {
  if (e.data.data && e.data.data.init) {
    model = null;
    qna.load().then(m => {
      model = m;
      self.postMessage({ id: e.data.id, data: {init: true, type: '${PayloadType.Init}' }});
    });
  }
  if (e.data.data && e.data.data.question && model) {
    model.findAnswers(e.data.data.question, e.data.data.passage)
      .then(answers => {
        self.postMessage({ id: e.data.id, data: { answers, type: '${PayloadType.Classified}' }});
      });
  }
});
`;

interface Initialization {
  type: PayloadType.Init;
  init: boolean;
}

interface Classify {
  type: PayloadType.Classify;
  passage: string;
  question: string;
}

interface Classified {
  type: PayloadType.Classified;
  answers: Prediction[];
}

type ModelPayload = Initialization | Classify | Classified;

@Injectable({
  providedIn: 'root'
})
export class QnAService implements OnDestroy {
  private _bus: MessageBus<ModelPayload>;
  private _initialized = false;

  constructor() {
    const blob = new Blob([workerScript], { type: 'text/javascript' });
    this._bus = new MessageBus(new Worker(window.URL.createObjectURL(blob)));
  }

  async init() {
    const { data } = await this._bus
      .request({ init: true, type: PayloadType.Init });
    if (data.type === PayloadType.Init && data.init) {
      this._initialized = true;
    }
  }

  async findAnswers(passage: string, question: string): Promise<Prediction[]> {
    if (!this._initialized) {
      throw new Error(
        'Make sure you set the model threshold before invoking classify'
      );
    }
    return this._bus
      .request({ type: PayloadType.Classify, passage, question })
      .then(({ data }: { data: ModelPayload }) => {
        if (data.type === PayloadType.Classified) {
          return data.answers;
        }
        return [];
      });
  }

  ngOnDestroy() {
    this._initialized = false;
    this._bus.destroy();
  }
}
