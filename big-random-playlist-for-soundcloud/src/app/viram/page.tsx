'use client';
import React, { useEffect, useRef, useState } from 'react';


// 생긴거 개못생겼고
// now playling... 넣어야함

const PlayApp = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationRef = useRef<number | null>(null);
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
          console.log(response.headers.get('Content-Length'));
          console.log(response.headers.get('duration'));
          const durationHeader = response.headers.get('duration');
          if (durationHeader) {
            durationRef.current = parseFloat(durationHeader)/1000;
          }
          await processChunkedResponse(response);
          onChunkedResponseComplete();
        } catch (error) {
          console.error(error);
        }
      };

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);
        console.log('audioRef is not null!');
      }

      if (audioRef && audioRef.current){
        console.log('adding event listener');
        audioRef.current.addEventListener('ended', () => {
          console.log('ended');
          fetchPlaylist('/api/soundcloud');
        });
      
        audioRef.current.addEventListener('timeupdate', () => {
          if (durationRef.current !== null) {
            const remaining = durationRef.current - audioRef.current.currentTime;
            console.log(remaining);
            if (remaining <= 1) {
              console.log('1 second left');
            }
          }
        });
      }

      function onChunkedResponseComplete() {
        console.log('all done!');
        if (audioRef && audioRef.current){
          console.log('adding event listener');
          audioRef.current.addEventListener('ended', () => {
            console.log('ended');
            fetchPlaylist('/api/soundcloud');
          });
        }
      }

      async function processChunkedResponse(response: Response) {
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

return (
  <div>
    <audio controls ref={audioRef} onEnded={myFunction} onPlay={onPlay} onPause={onPause} onError={onError}/>
  </div>
);
};

export default PlayApp;