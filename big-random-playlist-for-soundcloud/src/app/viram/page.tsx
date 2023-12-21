'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayApp = () => {
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
        const response = await axios.get('/api/soundcloud');
        console.log(response.data);
        setPlaylist(response.data);
    };

    fetchPlaylist();
  }, []);

  return (
    <div> Hello world~! </div>
  );
};

export default PlayApp;