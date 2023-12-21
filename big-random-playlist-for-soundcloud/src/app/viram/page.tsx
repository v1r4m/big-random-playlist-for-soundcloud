'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Soundcloud from "soundcloud.ts";

const PlayApp = () => {
    // const [playlist, setPlaylist] = useState(null);

    // useEffect(() => {
    //     const fetchPlayTest = async () => {
    //         const response = await axios.get('/api/soundcloud');
    //         console.log(response.data);
    //         setPlaylist(response.data);
    //     };

    //     fetchPlayTest();
    // }, []);

    return (
        <div>
            <audio controls>
                <source src="/api/soundcloud" type="audio/mpeg" />
            </audio>
        </div>
    );
};

export default PlayApp;