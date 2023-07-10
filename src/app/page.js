"use client";

import {
    BarChart,
    BarList,
    Bold,
    Card,
    Col,
    Divider,
    Flex,
    Title,
    Grid,
    DonutChart,
    DateRangePicker,
    Legend,
    ProgressBar,
    Subtitle,
    Select,
    SelectItem,
    List,
    ListItem,
    Text
} from '@tremor/react';
import Head from "next/head";
import { useState, useEffect } from 'react';
import TinybirdAPIConfigInput from './components/TinybirdAPIConfigInput';
import {
    fetchTinybirdUrl,
    getApiRatioOfFiltersUrl,
    getApiSignaturesExpiringSoonUrl,
    getApiRankingOfTopAccountsWithExpiredSignaturesUrl,
    getApiRankingOfTopAccountsCreatingSignaturesUrl,
    getApiTotalSignaturesPerMonthUrl,
    getApiUserCompletenessOfSignaturesUrl,
    handleInputTokenChange,
    percentageFormatter,
    numberDataFormatter,
} from './utils';

const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST;
const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

export default function Dashboard() {

    const [dates, setDates] = useState({
        from: new Date(2023, 5, 1),
        to: new Date()
    });

    // const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    let date_from = dates.from ? new Date(dates.from.getTime() - dates.from.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : new Date(2023, 5, 1).toISOString().substring(0, 10);
    let date_to = dates.to ? new Date(dates.to.getTime() - dates.to.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString().substring(0, 10) : date_from;

    const [token, setToken] = useState(TINYBIRD_TOKEN || '');
    const [host, setHost] = useState(TINYBIRD_HOST || 'api.tinybird.co');
    const [account_id, setAccountID] = useState('65827');

    const [ratio_of_filters, set_ratio_of_filters] = useState([{
        "percentage": 0,
        "status": '',
        "total_signatures": 0,
    }]);
    const [expiring_signatures, setExpiringSignatures] = useState([{
        "account_id": '',
        "until": '',
    }]);
    const [top_accounts_with_expired_signatures, setTopExpiringAccounts] = useState([{
        "name": '',
        "value": 0,
    }]);
    const [ranking_of_top_accounts_creating_signatures, setTopAccounts] = useState([{
        "account_id": '',
        "total_signatures": 0,
    }]);
    const [total_signatures_per_month, setTotalSignaturesPerMonth] = useState([{
        "month": "",
        "simple": 0,
        "advance(biometrics)": 0,
        "advance(digital certificate)": 0,
        "qualified": 0
    }]);
    const [userCompletnessOfSignatures, setUserCompletenessOfSignatures] = useState([{
        "account_id": 0,
        "signature_id": "",
        "status": "",
        "percentage_complete": 0,
        "color": 'grey',
    }]);

    const api_ratio_of_filters = getApiRatioOfFiltersUrl(host, token, date_from, date_to);
    let api_signatures_expiring_soon = getApiSignaturesExpiringSoonUrl(host, token)
    let api_ranking_of_top_accounts_with_expired_signatures = getApiRankingOfTopAccountsWithExpiredSignaturesUrl(host, token)
    let api_ranking_of_top_accounts_creating_signatures = getApiRankingOfTopAccountsCreatingSignaturesUrl(host, token)
    let api_total_signatures_per_month = getApiTotalSignaturesPerMonthUrl(host, token);
    let api_user_completeness_of_signatures = getApiUserCompletenessOfSignaturesUrl(host, token, account_id);

    useEffect(() => {
        fetchTinybirdUrl(api_ratio_of_filters, set_ratio_of_filters)
    }, [api_ratio_of_filters]);
    useEffect(() => {
        fetchTinybirdUrl(api_signatures_expiring_soon, setExpiringSignatures)
    }, []);
    useEffect(() => {
        fetchTinybirdUrl(api_ranking_of_top_accounts_with_expired_signatures, setTopExpiringAccounts)
    }, []);
    useEffect(() => {
        fetchTinybirdUrl(api_ranking_of_top_accounts_creating_signatures, setTopAccounts)
    }, []);
    useEffect(() => {
        fetchTinybirdUrl(api_total_signatures_per_month, setTotalSignaturesPerMonth)
    }, []);
    useEffect(() => {
        fetchTinybirdUrl(api_user_completeness_of_signatures, setUserCompletenessOfSignatures)
    }, [api_user_completeness_of_signatures]);


    return (
        <>
            <Head>
                <title>Signaturit POC</title>
            </Head>
            <main className="bg-slate-50 p-6 sm:p-10">
                <TinybirdAPIConfigInput
                    token={token}
                    host={host}
                    setHost={setHost}
                    handleInputTokenChange={handleInputTokenChange}
                    setToken={setToken}
                />
                <Divider />

                <Grid
                    numItems={1} numItemsSm={1} numItemsLg={4} className="gap-2"
                >
                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card>
                            <Title>Internal Signaturit Admin Dashboard</Title>
                        </Card>
                    </Col >
                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card>
                            <Title>Total number of signatures per month</Title>
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

                    <Col numColSpan={1} numColSpanLg={3}>
                        <Card>
                            <Title>Top accounts creating signatures</Title>
                            <Subtitle>
                                Ranked from highest to lowest
                            </Subtitle>
                            <BarChart
                                className="mt-6"
                                data={ranking_of_top_accounts_creating_signatures}
                                index="account_id"
                                categories={["total_signatures"]}
                                colors={["blue", "red"]}
                                valueFormatter={numberDataFormatter}
                                yAxisWidth={48}
                                showXAxis={true}
                                autoMinValue={true}
                            />
                        </Card>
                    </Col >

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card>
                            <Title>Ranking of the top accounts having signatures expired</Title>
                            <Subtitle>
                                Ranked from highest to lowest
                            </Subtitle>
                            <Flex className="mt-4">
                                <Text>
                                    <Bold>Account ID</Bold>
                                </Text>
                                <Text>
                                    <Bold>Expired Signatures</Bold>
                                </Text>
                            </Flex>
                            <BarList
                                className="mt-6"
                                data={top_accounts_with_expired_signatures}
                                valueFormatter={numberDataFormatter}
                            />
                        </Card>
                    </Col>

                    <Col numColSpan={1} numColSpanLg={2}>
                        <Card>
                            <Title>Ratio of signatures by Date</Title>
                            <DonutChart
                                className="mt-6"
                                label="status"
                                data={ratio_of_filters}
                                category="percentage"
                                index="status"
                                valueFormatter={percentageFormatter}
                                colors={["amber", "indigo", "rose", "cyan", "slate", "violet", "indigo", "amber", "cyan",]}
                            />
                            <Legend
                                className="mt-3"
                                categories={["in_queue", "ready", "signing", "completed", "expired", "canceled", "declined", "error"]}
                                colors={["amber", "indigo", "rose", "cyan", "slate", "violet", "indigo", "amber", "cyan"]}
                            />
                            <DateRangePicker
                                value={dates}
                                onValueChange={setDates}
                                enableYearPagination={false}
                                dropdownPlaceholder="Pick dates"
                                className="mt-2 mt-auto"
                                enableSelect={true}
                            />
                        </Card>
                    </Col>

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card className="mt-6">
                            <Title>Signatures Expiring Soon</Title>

                            <List>
                                {expiring_signatures.map((item) => (
                                    <ListItem key={item.account_id}>
                                        <span>{item.account_id}</span>
                                        <span>{item.until}</span>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Col>

                </Grid>

                <Divider />

                <Grid
                    numItems={1} numItemsSm={1} numItemsLg={4} className="gap-2"
                >
                    <Col numColSpan={1} numColSpanLg={2}>
                        <Card>
                            <Title>User Dashboard</Title>
                        </Card>
                    </Col >
                    <Col numColSpan={1} numColSpanLg={2}>
                        <Card >
                            <Text>Account</Text>
                            <Select
                                value={account_id}
                                text={account_id}
                                onValueChange={(value) => setAccountID(value)}
                            >
                                {ranking_of_top_accounts_creating_signatures.map((account) => (
                                    <SelectItem key={account.account_id}
                                        value={account.account_id}
                                        text={account.account_id}
                                    >
                                        {account.account_id}
                                    </SelectItem>
                                ))}
                            </Select>
                        </Card>
                    </Col>


                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card className="mt-6">
                            <Title>Status of your signatures</Title>

                            <List>
                                {userCompletnessOfSignatures.map((item) => (

                                    <Card className="max-w-sm mx-auto" key={item.signature_id}>
                                        <Flex>
                                            <Text>{item.percentage_complete}%</Text>
                                            <Text>{item.status}</Text>
                                        </Flex>
                                        <ProgressBar value={item.percentage} color={item.color} className="mt-3" />
                                    </Card>
                                ))}
                            </List>
                        </Card>
                    </Col>

                </Grid>

            </main >
        </>
    );
}

