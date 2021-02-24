import { MessageBus } from './message-bus';

export type Label =
  | 'identity_attack'
  | 'insult'
  | 'threat'
  | 'sexual_explicit'
  | 'obscene'
  | 'toxicity';

type ModelPrediction = {
  label: Label;
  results: {
    probabilities: Float32Array;
    match: boolean;
  }[];
};

export interface Prediction {
  label: Label;
  match: boolean;
  probabilities: Float32Array[];
}

const transform = (prediction: ModelPrediction): Prediction => {
  return {
    label: prediction.label as Label,
    match: prediction.results.reduce((a: boolean, c) => a || c.match, false),
    probabilities: prediction.results.map((p) => p.probabilities),
  } as Prediction;
};

const enum PayloadType {
  Init = 'init',
  Classify = 'classify',
  Classified = 'classified'
}

const workerScript = `
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/toxicity');

let model = null;
self.addEventListener('message', (e) => {
  if (e.data.data && e.data.data.init) {
    model = null;
    toxicity.load(e.data.data.threshold).then(m => {
      model = m;
      self.postMessage({ id: e.data.id, data: {init: true, type: '${PayloadType.Init}' }});
    });
  }
  if (e.data.data && e.data.data.sentences && model) {
    model.classify(e.data.data.sentences)
      .then(predictions => {
        self.postMessage({ id: e.data.id, data: { predictions, type: '${PayloadType.Classified}' }});
      });
  }
});
`;

interface Initialization {
  type: PayloadType.Init;
  init: boolean;
  threshold: number;
}

interface Classify {
  type: PayloadType.Classify;
  sentences: string[];
}

interface Classified {
  type: PayloadType.Classified;
  predictions: ModelPrediction[];
}

type ModelPayload = Initialization | Classify | Classified;

export class ModelProxy {
  private _bus: MessageBus<ModelPayload>;
  private _initialized = false;

  constructor() {
    const blob = new Blob([workerScript], { type: 'text/javascript' });
    this._bus = new MessageBus(new Worker(window.URL.createObjectURL(blob)));
  }

  async init(threshold: number) {
    const { data } = await this._bus
      .request({ threshold, init: true, type: PayloadType.Init });
    if (data.type === PayloadType.Init && data.init) {
      this._initialized = true;
    }
  }

  async classify(sentences: string[]): Promise<Prediction[]> {
    if (!this._initialized) {
      throw new Error(
        'Make sure you set the model threshold before invoking classify'
      );
    }
    console.log(sentences);
    return this._bus
      .request({ type: PayloadType.Classify, sentences })
      .then(({ data }: { data: ModelPayload }) => {
        if (data.type === PayloadType.Classified) {
          return data.predictions.map(transform);
        }
        return [];
      });
  }
}
