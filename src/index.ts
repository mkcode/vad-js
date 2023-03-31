
export async function initializeRnnoise(workletUrl: string | URL, audioContext: AudioContext): Promise<AudioWorkletNode | undefined> {
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

    return new AudioWorkletNode(audioContext, 'NoiseSuppressorWorklet');

}
