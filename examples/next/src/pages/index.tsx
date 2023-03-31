import { useCallback, useEffect, useRef } from 'react'
import { initializeRnnoise } from 'vad-js'

export default function Home() {
  const audioCtx = useRef<AudioContext>();

  useEffect(() => {
  }, [])

  const start = useCallback(async () => {
    if (!audioCtx.current) {
      audioCtx.current = new AudioContext();
    }

    const workletUrl = new URL('vad-js/vadNodeWorklet', import.meta.url);

    const stream = await navigator.mediaDevices.getUserMedia({audio: true });
    const source = audioCtx.current.createMediaStreamSource(stream);


    const rnn = await initializeRnnoise(workletUrl, audioCtx.current);
    if (!rnn) {
      throw new Error('Failed to initialize rnnoise');
    }
    source.connect(rnn);
    window.rnn = rnn;

  }, [])

  return (
    <main className="flex flex-col justify-between items-center p-24 min-h-screen">
      <div className="z-10 justify-between items-center w-full max-w-5xl font-mono text-sm lg:flex">
        <button
          type="button"
          className="z-50 py-2.5 px-3.5 text-sm font-semibold text-white bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={start}
        >
          Start
        </button>
      </div>


    </main>
  )
}
