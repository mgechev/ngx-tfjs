import { MessageBus } from './message-bus';

describe('MessageBus', () => {
  it('should listen for messages', () => {
    const worker = {
      addEventListener(msg: string, callback: any) {

      }
    };
    const listenerSpy = spyOn(worker, 'addEventListener');
    const bus = new MessageBus(worker as any);
    expect(listenerSpy).toHaveBeenCalled();
  });
});
