import { useCallback, useEffect, useRef, useState } from 'react'
import { MicNode, VadProcessor, initializeRnnoiseWorklet } from 'vad-js'

export default function Home() {
  const audioCtx = useRef<AudioContext>();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

  useEffect(() => {
  }, [])

  const start = useCallback(async () => {
    const micNode = new MicNode()
    const vadProcessor = await VadProcessor.initialize(micNode)
    vadProcessor.addEventListener('vad', (event) => {
      switch (event.detail?.msg) {
        case "SPEECH_END":
          setIsSpeaking(false);
          console.log("SPEECH_END");
          break;
        case "SPEECH_START":
          setIsSpeaking(true);
          console.log("SPEECH_START");
          break;
        case "VAD_MISFIRE":
          setIsSpeaking(false);
          console.log("VAD_MISFIRE");
          break

        default:
          break
      }
    })

    micNode.start();
  }, [])

  const startWorklet = useCallback(async () => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }

    const workletUrl = new URL('vad-js/vadNodeWorklet', import.meta.url);

    const stream = await navigator.mediaDevices.getUserMedia({audio: true });
    const source = audioCtx.current.createMediaStreamSource(stream);


    const rnn = await initializeRnnoiseWorklet(workletUrl, audioCtx.current);
    if (!rnn) {
      throw new Error('Failed to initialize rnnoise');
    }
    source.connect(rnn);

    rnn.port.onmessage = async (ev: MessageEvent) => {
      switch (ev.data?.msg) {
        case "SPEECH_END":
          setIsSpeaking(false);
          console.log("SPEECH_END");
          break;
        case "SPEECH_START":
          setIsSpeaking(true);
          console.log("SPEECH_START");
          break;
        case "VAD_MISFIRE":
          setIsSpeaking(false);
          console.log("VAD_MISFIRE");
          break

        default:
          break
      }
    }


  }, [])

  return (
    <main className="flex flex-col justify-between items-center p-24 min-h-screen">
      <div className="z-10 justify-between items-center w-full max-w-5xl font-mono text-sm lg:flex">
        <button
          type="button"
          className="z-50 py-2.5 px-3.5 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={start}
        >
          Start Browser
        </button>
        <button
          type="button"
          className="z-50 py-2.5 px-3.5 ml-2 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={startWorklet}
        >
          Start Worklet
        </button>
        { isSpeaking &&
        <div className="z-50 py-2.5 px-3.5 mt-20 text-sm font-semibold text-white bg-green-500 rounded-md shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500">
          Speaking
        </div>
        }
      </div>


    </main>
  )
}
