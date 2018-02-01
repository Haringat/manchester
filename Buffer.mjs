import stream from "stream";

const {
    Duplex
} = stream;

export default class StreamBuffer extends Duplex {

    constructor() {
        super();
        this._parts = [];
    }

    _write(chunk, encoding, callback) {
        this._parts.push(chunk);
        callback();
    }

    _read(size) {
    }

    _final() {
        this.push(Buffer.concat(this._parts));
    }

}
