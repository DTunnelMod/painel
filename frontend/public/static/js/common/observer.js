class Observer {
    constructor(event, callback) {
        this.event = event;
        this.callback = callback;
    }
}

class Observable {
    constructor() {
        this.observers = [];
    }

    register(observer) {
        this.observers.push(observer);
    }

    notify(event, data) {
        for (let observer of this.observers) {
            if (observer.event === event) {
                observer.callback(data);
            }
        }
    }
}

export { Observer, Observable };