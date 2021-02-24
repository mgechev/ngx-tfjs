import { MessageBus } from './message-bus';

describe('MessageBus', () => {
  it('should listen for messages', () => {
    const worker = {
      addEventListener(msg: string, callback: any) {

      }
    };
    const listenerSpy = spyOn(worker, 'addEventListener');
    new MessageBus(worker as any);
    expect(listenerSpy).toHaveBeenCalled();
  });

  it('should forward messages to the worker', async () => {
    let latest: any = null;
    let callback: any = null;
    const worker = {
      addEventListener(msg: string, cb: any) {
        callback = cb;
      },
      postMessage(msg: any) {
        latest = msg;
      }
    };
    const sendMsg = spyOn(worker, 'postMessage').and.callThrough();
    const bus = new MessageBus(worker as any);

    // Send a message
    const promise = bus.request({});
    expect(sendMsg).toHaveBeenCalled();
    expect(latest).not.toBeNull();
    expect(latest.id).not.toBeUndefined();

    // Responding to the message. The handler receives an object
    // with a data property.
    callback({ data: latest });
    const message = await promise;
    expect(message).toBe(latest);
  });
});
