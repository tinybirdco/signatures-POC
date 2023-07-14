// components/TremorComponent.js
import {
    Card,
    Col,
    Title,
    BarChart,
} from '@tremor/react';
import React, { useState, useEffect } from 'react';
import {
    numberDataFormatter,
} from '../utils';
import { fetchTinybirdUrl, getApiTotalSignaturesPerMonthUrl } from '../services/apiService';

const TotalSignaturesPerMonth = ({ token, host, date_from, date_to }) => {
    const [total_signatures_per_month, setTotalSignaturesPerMonth] = useState([{
        "month": "",
        "simple": 0,
        "advance(biometrics)": 0,
        "advance(digital certificate)": 0,
        "qualified": 0
    }]);
    let api_total_signatures_per_month = getApiTotalSignaturesPerMonthUrl(host, token, date_from, date_to);

    useEffect(() => {
        fetchTinybirdUrl(api_total_signatures_per_month, setTotalSignaturesPerMonth)
    }, [api_total_signatures_per_month]);

    return (
        <Col numColSpan={1} numColSpanLg={3}>
            <Card>
                <Title>Total number of signatures compared to the previous month</Title>
                <BarChart
                    className="mt-6"
                    data={total_signatures_per_month}
                    index="month"
                    categories={["simple", "advance(biometrics)", "advance(digital certificate)", "qualified"]}
                    colors={["blue", "red", "amber", "indigo", "rose", "cyan"]}
                    valueFormatter={numberDataFormatter}
                    yAxisWidth={48}
                    showXAxis={true}
                    autoMinValue={true}
                />
            </Card>
        </Col >
    );
};

export default TotalSignaturesPerMonth;
