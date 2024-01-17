'use client';
import React, { useEffect, useRef, useState } from 'react';


// 생긴거 개못생겼고
// now playling... 넣어야함

const PlayApp = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const durationRef = useRef<number | null>(null);
  const nfRef = useRef<number>(0);
  const isFetchPlaylistCalled = useRef(false);
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
          if(nfRef.current === 0){
            const response = await fetch(url);
            console.log(response.headers.get('url'));
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
            nfRef.current = 0;
          }
        } catch (error) {
          console.error(error);
        }
      };

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);
        console.log('audioRef is not null!');
      }
      const timeUpdateHandler = () => {
        if (durationRef.current !== null) {
          const remaining = durationRef.current - audioRef.current.currentTime;
          if (remaining <= 1 && !isFetchPlaylistCalled.current) {
            isFetchPlaylistCalled.current = true;
            console.log('1 second left');
            audioRef.current.removeEventListener('timeupdate', timeUpdateHandler);
            fetchPlaylist('/api/soundcloud').then(() => {
              nfRef.current = 1;
              if (sourceBuffer) {
                mediaSource.removeSourceBuffer(sourceBuffer);
              }
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
                audioRef.current.src = URL.createObjectURL(mediaSource);
                audioRef.current.load();
              }
              audioRef.current.addEventListener('timeupdate', timeUpdateHandler);
              isFetchPlaylistCalled.current = false;
            });
          }
        }
      };
      if (audioRef && audioRef.current){
        console.log('adding event listener');
        audioRef.current.addEventListener('timeupdate', timeUpdateHandler);
      }
      
      
      audioRef.current.addEventListener('timeupdate', timeUpdateHandler);

      function onChunkedResponseComplete() {
        console.log('all done!');
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

return (
  <div>
    <audio controls ref={audioRef} onEnded={myFunction} onPlay={onPlay} onPause={onPause} onError={onError}/>
  </div>
);
};

export default PlayApp;