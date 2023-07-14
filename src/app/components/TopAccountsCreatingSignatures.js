import {
    Card,
    Col,
    Subtitle,
    Title,
    BarChart,
} from '@tremor/react';
import React, { useState, useEffect } from 'react';
import {
    numberDataFormatter,
} from '../utils';
import { fetchTinybirdUrl, getApiRankingOfTopAccountsCreatingSignaturesUrl } from '../services/apiService';

const TopAccountsCreatingSignatures = ({ token, host, date_from, date_to }) => {
    const [ranking_of_top_accounts_creating_signatures, setTopAccounts] = useState([{
        "organization": "",
        "account_id": '',
        "total_signatures": 0,
    }]);
    let api_ranking_of_top_accounts_creating_signatures = getApiRankingOfTopAccountsCreatingSignaturesUrl(host, token, date_from, date_to)

    useEffect(() => {
        fetchTinybirdUrl(api_ranking_of_top_accounts_creating_signatures, setTopAccounts)
    }, [api_ranking_of_top_accounts_creating_signatures]);

    return (
        <Col numColSpan={1} numColSpanLg={2}>
            <Card>
                <Title>Top accounts creating signatures</Title>
                <Subtitle>
                    Ranked from highest to lowest
                </Subtitle>
                <BarChart
                    className="mt-6"
                    data={ranking_of_top_accounts_creating_signatures}
                    index="organization"
                    categories={["total_signatures"]}
                    colors={["blue", "red"]}
                    valueFormatter={numberDataFormatter}
                    yAxisWidth={48}
                    showXAxis={true}
                />
            </Card>
        </Col >
    );
};

export default TopAccountsCreatingSignatures;
