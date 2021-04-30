# ngx-tfjs

This project contains Angular bindings for TensorFlow.js models. The library simplifies using ML in the browser by:

- Providing services and pipes wrapping the models, exposing a declarative interface to interact with TensorFlow.js
- Loading them lazily, to make sure they are not blocking page rendering, nor impacting Core Web Vitals
- Running the model in a Web Worker, to ensure they are not blocking the main thread

## Usage

* Add to your project:

```shell
ng add ngx-tfjs
```

The schematics will:
- Install the package
- Add it to your `package.json`
- Add the `TFJSModule` to your `app.module.ts`

In your `app.component.html` try the models by:

```html
{{ 'you suck' | toxicity | async | json }}
```

The toxicity model will categorize the string `'you suck'` as toxic ✨.

**You're done!**

### Manual

* Install:

```
yarn add ngx-tfjs
```

* Import:

```ts
import { ToxicityModule } from 'ngx-tfjs';

@NgModule({
  imports: [ToxicityModule]
})
export class AppComponent {}
```

* Use:

```ts
{{ text | toxicity | async | json }}
```

You can also inject the `ToxicityService`:

```ts
@Component({ ... })
export class AppComponent {
  constructor(private service: ToxicityService) {
    service.init(THRESHOLD);
  }

  makePrediction(text: string) {
    const predictions = await this.service.classify(text);
    console.log(predictions);
  }
}
```

The model also provides a pipe and a service for answering questions based on a given text:

* Import:

```ts
import { QnAModule } from 'ngx-tfjs';

@NgModule({
  imports: [QnAModule]
})
export class AppComponent {}
```

* Use:

```ts
{{ text | qna: question | async | json }}
```

## License

MIT
