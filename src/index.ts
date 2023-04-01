import { Message } from "./lib/message"

export { MicNode } from "./lib/micNode"
export { VadProcessor } from "./lib/vadProcessor"

export async function initializeRnnoiseWorklet(workletUrl: string | URL, audioContext: AudioContext): Promise<AudioWorkletNode | undefined> {
    // await audioContext.resume();

    // const baseUrl = `${getBaseUrl()}libs/`;
    // const workletUrl = `${baseUrl}noise-suppressor-worklet.min.js`;
    // const workletUrl = `./vadNodeWorklet.js`;
    // await audioContext.audioWorklet.addModule(workletUrl);

    try {
        await audioContext.audioWorklet.addModule(workletUrl);
    } catch (e) {
        console.error('Error while adding audio worklet module: ', e);

        return;
    }

    // After the resolution of module loading, an AudioWorkletNode can be constructed.
    const node = new AudioWorkletNode(audioContext, 'NoiseSuppressorWorklet');

    node.port.onmessage = async (ev: MessageEvent) => {
      // console.log('Message from worklet: ', ev.data);

      switch (ev.data?.msg) {
        case Message.SpeechEnd:
        case Message.SpeechStart:
        case Message.VADMisfire:
          console.log('Message from worklet: ', ev.data);
          break

        default:
          break
      }
    }


    return node;


}
