// @ts-ignore

export class MicNode extends EventTarget {
  private audioContext: AudioContext | undefined;
  private mediaStream: MediaStreamAudioSourceNode | undefined;
  private stream: MediaStream | undefined;
  private scriptProcessor: ScriptProcessorNode | undefined;

  constructor() {
    super();
    this.audioContext = undefined
    this.stream = undefined;
    this.mediaStream = undefined;
    this.scriptProcessor = undefined;
  }

  async start() {
    this.audioContext = new AudioContext();
    this.stream = await navigator.mediaDevices.getUserMedia({audio: true });
    // this.options.sampleRate = this.audioContext.sampleRate
    this.mediaStream = this.audioContext.createMediaStreamSource(this.stream)
    this.scriptProcessor = this.audioContext.createScriptProcessor(256, 1, 1)
    this.scriptProcessor.onaudioprocess = (frameData) => {
      const frame = frameData.inputBuffer.getChannelData(0)
      this.dispatchEvent(new CustomEvent<Float32Array>('micFrame', { detail: frame }))
    }
    this.mediaStream.connect(this.scriptProcessor)
    this.scriptProcessor.connect(this.audioContext.destination)
  }
}
