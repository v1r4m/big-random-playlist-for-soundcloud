'use client';
import React, { useEffect, useRef, useState } from 'react';


// 생긴거 개못생겼고
// now playling... 넣어야함

const PlayApp = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationRef = useRef<number | null>(null);
  const isFetchPlaylistCalled = useRef(false);
  const [songName, setSongName] = useState('please press play');
  useEffect(() => {
    console.log('triggered effect');
    if (window.MediaSource) {
      const mediaSource = new MediaSource();
      let sourceBuffer: SourceBuffer | null = null;

      mediaSource.addEventListener('sourceopen', async () => {
        sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
        await fetchPlaylist('/api/soundcloud');
      });

      const fetchPlaylist = async (url: string) => {
        try {
            const response = await fetch(url);
            console.log(response.headers.get('url'));
            setSongName(response.headers.get('url') || 'Wait for it...');
            console.log(response.headers.get('Content-Length'));
            console.log(response.headers.get('duration'));
            const durationHeader = response.headers.get('duration');
            if (durationHeader) {
              durationRef.current = parseFloat(durationHeader)/1000;
            }
            await processChunkedResponse(response);
            
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play();
            }
            onChunkedResponseComplete();

        } catch (error) {
          console.error(error);
        }
      };

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);
        console.log('audioRef is not null!');
      }
      const timeUpdateHandler = () => {
        if (durationRef.current !== null && audioRef.current) {
          const remaining = durationRef.current - audioRef.current.currentTime;
          if (remaining <= 1 && !isFetchPlaylistCalled.current) {
            isFetchPlaylistCalled.current = true;
            console.log('1 second left');
            audioRef.current?.pause();
            if (mediaSource.sourceBuffers.length > 0 && sourceBuffer) {
              mediaSource.removeSourceBuffer(sourceBuffer);
            }
            
            audioRef.current.removeEventListener('timeupdate', timeUpdateHandler);
            fetchPlaylist('/api/soundcloud').then(() => {
              if (mediaSource.readyState === 'open') {
                // Add a new SourceBuffer to the MediaSource
                sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
              } else if (mediaSource.readyState === 'ended') {
                // Change the MediaSource's readyState to 'open'
                mediaSource.endOfStream();
                mediaSource.addEventListener('sourceopen', () => {
                  // Add a new SourceBuffer to the MediaSource
                  sourceBuffer = mediaSource.addSourceBuffer('audio/mpeg');
                });
              }
              if (audioRef.current) {
                console.log('setting src');
                audioRef.current.src = URL.createObjectURL(mediaSource);
                console.log(audioRef.current.src);
                audioRef.current.load();
                audioRef.current.play();
              }
              isFetchPlaylistCalled.current = false;
            });
          }
        }
      };
      if (audioRef && audioRef.current){
        audioRef.current.addEventListener('timeupdate', timeUpdateHandler);
      }

      const onChunkedResponseComplete = () => {
        console.log('all done!');
      }

      const processChunkedResponse = async (response: Response) =>{
        const reader = response.body!.getReader();
      
        while (true) {
          const result = await reader.read();
          if (result.done) {
            if (sourceBuffer && !sourceBuffer.updating) {
              sourceBuffer.addEventListener('updateend', () => {
                if (!sourceBuffer!.updating) {
                  console.log('Calling endOfStream');
                  mediaSource.endOfStream();
                }
              });
            }
            console.log('returning');
            break;
          } else {
            if (sourceBuffer) {
              while (sourceBuffer.updating) {
                await new Promise(resolve => setTimeout(resolve, 100));
              }
              sourceBuffer.appendBuffer(result.value);
              if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play();
              }
            }
            console.log('recursing');
          }
        }
      }
    }
  }, []);

function myFunction() {
  console.log('ended');
}

function onPlay() {
  console.log('play');
}

function onPause() {
  console.log('pause');
}

function onError() {
  console.log('error');
}

const playAudio = () => {
  if (audioRef.current) {
    audioRef.current.play();
  }
};

const pauseAudio = () => {
  if (audioRef.current) {
    audioRef.current.pause();
  }
};

const skipAudio = () => {
  if (audioRef.current) {
    audioRef.current.currentTime += 10;
  }
};

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="mb-4 text-s">Now Playing: {songName}</h1>
    <audio ref={audioRef} controls className="mb-4" onEnded={myFunction} onPlay={onPlay} onPause={onPause} onError={onError}>
      <source type="audio/mpeg" />
    </audio>
    <div className="flex space-x-4">
      <button onClick={playAudio} className="px-4 py-2 text-white bg-blue-500 rounded">Play</button>
      <button onClick={pauseAudio} className="px-4 py-2 text-white bg-blue-500 rounded">Pause</button>
      <button onClick={skipAudio} className="px-4 py-2 text-white bg-blue-500 rounded">Skip</button>
    </div>
  </div>
);
};



export default PlayApp;