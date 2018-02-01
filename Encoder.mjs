import stream from "stream";

const {
    Transform
} = stream;

export default class Encoder extends Transform {

    _transform(chunk, encoding, callback) {
        try {
            const result = Buffer.alloc(chunk.length * 2);
            chunk.forEach((byte, index) => {
                index *= 2;
                if (byte === 0) {
                    result[index] = 1;
                    result[index + 1] = 0;
                } else {
                    result[index] = 0;
                    result[index + 1] = 1;
                }
            });
            callback(null, result);
        } catch (e) {
            callback(e);
        }
    }

}
