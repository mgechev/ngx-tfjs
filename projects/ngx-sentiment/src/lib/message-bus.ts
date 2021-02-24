const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface Message<Data> {
  id: string;
  error: boolean;
  data: Data;
}

type Callback<Data> = (message: Message<Data>) => void;

export class MessageBus<Data> {
  private _callbacks = new Map<
    string,
    { resolve: Callback<Data>; reject: Callback<Data> }
  >();

  constructor(private _worker: Worker) {
    this._worker.addEventListener('message', ({ data }) => {
      const callbacks = this._callbacks.get(data.id);
      if (!callbacks) {
        console.warn('No callback for ', data.id);
        return;
      }
      if (!data.error) {
        callbacks.resolve(data);
      } else {
        callbacks.reject(data);
      }
      this._callbacks.delete(data.id);
    });
  }

  request(data: Data): Promise<Message<Data>> {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this._callbacks.set(id, { resolve, reject });
      this._worker.postMessage({ id, data });
    });
  }
}
