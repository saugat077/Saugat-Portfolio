'use client'

import { useRef, useState } from 'react'

export default function NameAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)

  function play() {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    void audio.play()
  }

  return (
    <>
      <button
        id="name-audio-btn"
        type="button"
        onClick={play}
        aria-label="Hear name pronunciation"
        className="shrink-0 cursor-pointer bg-transparent border-0 p-0 leading-none"
      >
        <svg
          id="name-audio-icon"
          className="w-[13px] h-[11px] sm:w-[17px] sm:h-[15px] text-[#a1a1aa]"
          viewBox="0 0 13 11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          aria-hidden="true"
          style={playing ? { animation: 'name-audio-pulse 0.9s ease-in-out infinite' } : undefined}
        >
          <path d="M7.5 0.5v10L3.5 7H1a.5.5 0 01-.5-.5v-3A.5.5 0 011 3h2.5L7.5.5z" fill="currentColor" stroke="none" />
          <path d="M9.5 2.5a4 4 0 010 6M11 1a6.5 6.5 0 010 9" />
        </svg>
      </button>
      <audio
        id="name-audio"
        ref={audioRef}
        src="/audio/name.mp3"
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
    </>
  )
}
