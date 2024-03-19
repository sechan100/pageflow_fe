

export default class EventEmitter {
  // [[ 싱글턴 
  static #instance: EventEmitter | null = null;
  static getInstance(): EventEmitter {
    if (EventEmitter.#instance === null) {
      EventEmitter.#instance = new EventEmitter();
    }
    return EventEmitter.#instance;
  }
  // ]]
  events: { [event: string]: Function[] };

  private constructor() {
    this.events = {};
  }

  // 이벤트 리스너 등록
  on(event: string, listener: Function) {
    if(!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // 이벤트 발행
  emit(event: string, ...args: any[]) {
    if(this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  // 이벤트 리스너 제거
  off(event: string, listenerToRemove: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
  }
}