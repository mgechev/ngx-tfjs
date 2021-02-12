import { Injectable, NgZone } from '@angular/core';
import { load, ToxicityClassifier } from '@tensorflow-models/toxicity';

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

@Injectable({
  providedIn: 'root',
})
export class SentimentService {
  private model?: ToxicityClassifier;

  constructor(private _zone: NgZone) {}

  async setThreshold(value: number) {
    return this._zone.runOutsideAngular(async () => {
      return (this.model = await load(value, []));
    });
  }

  async classify(sentences: string[]): Promise<Prediction[]> {
    return this._zone.runOutsideAngular(async () => {
      if (!this.model) {
        throw new Error(
          'Make sure you set the model threshold before invoking classify'
        );
      }
      return (await this.model.classify(sentences)).map((p) =>
        transform(p as ModelPrediction)
      ) as Prediction[];
    });
  }
}
