export class Queue<T> {
    private _store: T[] = [];
    push(val: T) {
        this._store.push(val);
    }
    pop(): T | undefined {
        return this._store.shift();
    }
    surePop(): T {
        var val = this.pop();
        if (val) return val;
        throw new Error("surePop had nothing to pop");
    }
    get length() {
        return this._store.length;
    }
}
