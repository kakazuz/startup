const RosterEvent = {
  Connected: 'connected',
  Disconnected: 'disconnected',
  PersonAdded: 'person-added'
};

class EventMessage {
  constructor(from, value) {
    this.from = from;
    this.value = value;
  }
}

class RosterEventNotifier {
  handlers = [];
  events = [];

  constructor() {
    let port = window.location.port;
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    this.socket.onopen = () => {
      this.receiveEvent(new EventMessage('Startup', { msg: 'connected' }));
    };
    this.socket.onclose = () => {
      this.receiveEvent(new EventMessage('Startup', { msg: 'disconnected' }));
    };
    this.socket.onmessage = async (message) => {
      try {
        const event = JSON.parse(await message.data.text());
        this.receiveEvent(event);
      } catch {}
    };
  }


  broadcastEvent(from, value) {
    const event = new EventMessage(from, value);
    this.socket.send(JSON.stringify(new EventMessage(from, value)));
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers.filter((h) => h !== handler);
  }

  receiveEvent(event) {
    this.events.push(event);

    this.events.forEach((e) => {
      this.handlers.forEach((handler) => {
        handler(e);
      });
    });
  }
}

const RosterNotifier = new RosterEventNotifier();
export { RosterEvent, RosterNotifier };
