export class UploadFileHelper {
    // converting  buffer to array buffer for reading file
    public async toArrayBuffer(buf) {
        const buffer = new ArrayBuffer(buf.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return buffer;
    }
}
