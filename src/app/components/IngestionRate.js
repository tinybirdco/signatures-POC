// components/TremorComponent.js
import {
    Badge,
} from '@tremor/react';
import React, { useState, useEffect } from 'react';
import { fetchTinybirdUrl, getApiIngestionRate } from '../services/apiService';

const IngestionRate = ({ token, host }) => {
    const [ingestedSignaturesPerSec, setIngestedSignaturesPerSec] = useState([{
        "rate_per_second": 0
    }]);
    const refreshRate = 5000; // 5 seconds
    let api_get_ingestion_rate = getApiIngestionRate(host, token)

    useEffect(() => {
        // start polling when the component is mounted
        const interval = setInterval(() => {
            fetchTinybirdUrl(api_get_ingestion_rate, setIngestedSignaturesPerSec)
        }, refreshRate);

        // cleanup function
        return () => clearInterval(interval);
    }, []); // only re-run effect if component re-renders

    return (

        <Badge>
            {ingestedSignaturesPerSec[0].rate_per_second} signatures per second
        </Badge>

    );
};

export default IngestionRate;
