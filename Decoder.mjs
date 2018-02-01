import stream from "stream";

const {
    Transform
} = stream;

export default class Decoder extends Transform {

    constructor(options) {
        super(options);
        /**
         * @type {Buffer}
         * @private
         */
        this._context = Buffer.alloc(4);
        /**
         * @type {Buffer}
         * @private
         */
        this._signalStart = Buffer.from([0,0,0,1,1,0,0,1,0]);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {Buffer} chunk
     * @param {string} encoding
     * @param {Function} callback
     * @private
     */
    _transform(chunk, encoding, callback) {
        try {
            chunk = Buffer.from(chunk);
            console.log(chunk.toString("hex"));
            console.log();
            this._context = Buffer.concat([this._context.slice(this._context.length / 2), chunk]);
            let offset = this._context.indexOf(this._signalStart);
            while (offset !== -1) {
                console.log(`found package at ${offset}`);
                let end = this._context.indexOf(Buffer.from(0, 0, 0));
                let length = end - offset;
                if (length % 2 === 1) {
                    length++;
                }
                this.push(Decoder._decode(this._context.slice(offset + this._signalStart.length, offset + this._signalStart.length + length)));
                offset = this._context.indexOf(this._signalStart, offset);
            }
            callback();
        } catch (e) {
            callback(e);
        }
    }

    /**
     *
     * @param {Buffer} chunk
     * @return {Buffer}
     * @private
     */
    static _decode(chunk) {
        // create a working-copy
        chunk = Buffer.from(chunk);

        console.log(`decoding chunk ${chunk.toString("hex")}`);

        /**
         * @type {Buffer}
         */
        const result = Buffer.alloc(chunk.length / 2);

        for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] !== chunk[i + 1]) {
                result[i / 2] = chunk[i + 1];
            } else {
                throw new Error("invalid signal detected");
            }
        }

        console.log(`decoded: ${result.toString("hex")}`);
    }

}
