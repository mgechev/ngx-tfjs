import { Injectable } from '@angular/core';
import { ModelProxy, Prediction } from './model';

@Injectable({
  providedIn: 'root',
})
export class SentimentService {
  private model = new ModelProxy();

  async init(value: number) {
    await this.model.init(value);
  }

  async classify(sentences: string[]): Promise<Prediction[]> {
    return this.model.classify(sentences);
  }
}
