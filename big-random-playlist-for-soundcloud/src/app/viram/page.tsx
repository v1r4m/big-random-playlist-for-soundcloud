'use client';
import React, { useEffect, useRef } from 'react';

const PlayApp = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const getPlaylist = async() => {
    try{
      const response = await fetch('/api/playlist');
      const data = await response.json();
      console.log(data);
    }catch(error){{
      console.log(error);
    }}
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  useEffect(() => {
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
          await processChunkedResponse(response);
          onChunkedResponseComplete();
        } catch (error) {
          console.error(error);
        }
      };

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(mediaSource);

        // Add event listener for 'ended' event
        audioRef.current.addEventListener('ended', () => {
          fetchPlaylist('/api/soundcloud/new');
        });
      }

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
                  mediaSource.endOfStream();
                }
              });
            }
            console.log('returning');
            break;
          } else {
            if (sourceBuffer && !sourceBuffer.updating) {
              sourceBuffer.appendBuffer(result.value);
            }
            console.log('recursing');
          }
        }
      }
    }
  }, []);

  return (
    <div>
      <audio controls ref={audioRef} />
    </div>
  );
};

export default PlayApp;