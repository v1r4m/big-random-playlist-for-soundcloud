'use client';

import React, { useEffect, useRef } from 'react';

const TestApp = () => {
    const test = async() => {
        try{
            const response = await fetch('/api/playlist');
            console.log(await response.json());
        }catch{

        }
    }

    useEffect(() => {
        test();
    });
}

export default TestApp;