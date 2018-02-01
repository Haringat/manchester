import Encoder from "./Encoder";
import Decoder from "./Decoder";
import StreamBuffer from "./Buffer";

export function decode() {
    return new StreamBuffer().pipe(new Decoder());
}

export function encode() {
    return new Encoder();
}
