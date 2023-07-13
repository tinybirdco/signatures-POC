"use client";

import {
    Badge,
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
    LineChart,
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
    getDateOrDefault,
    getNextDay,
    fetchTinybirdUrl,
    getApiRatioOfFiltersUrl,
    getApiSignaturesExpiringSoonUrl,
    getApiRankingOfTopAccountsWithExpiredSignaturesUrl,
    getApiRankingOfTopAccountsCreatingSignaturesUrl,
    getApiTotalSignaturesPerMonthUrl,
    getApiUserCompletenessOfSignaturesUrl,
    getApiNewSignaturesPerDay,
    getApiUserStatusOfSignaturesPerDay,
    getApiTenRandomUsers,
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

    let defaultDate = new Date(2023, 5, 1);
    let date_from = getDateOrDefault(dates.from, defaultDate);
    let date_to = getNextDay(dates.to) || date_from;

    const [token, setToken] = useState(TINYBIRD_TOKEN || '');
    const [host, setHost] = useState(TINYBIRD_HOST || 'api.tinybird.co');
    const [account, setAccount] = useState({
        "account_id": 52860,
        "organization": "",
        "certified_SMS": 0,
        "certified_email": 0,
        "created_on": "",
        "email": "",
        "person": "",
        "phone": "",
        "photo_id_certified": 0,
        "role": "",
        "status": "",
        "timestamp": 0
    });
    const [ratio_of_filters, set_ratio_of_filters] = useState([{
        "percentage": 0,
        "status": '',
        "total_signatures": 0,
    }]);
    const [expiring_signatures, setExpiringSignatures] = useState([{
        "signature_id": "",
        "account_id": '',
        "until": '',
    }]);
    const [top_accounts_with_expired_signatures, setTopExpiringAccounts] = useState([{
        "organization": "",
        "value": 0,
    }]);
    const [ranking_of_top_accounts_creating_signatures, setTopAccounts] = useState([{
        "organization": "",
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
    const [newSignaturesPerDay, setNewSignaturesPerDay] = useState([{
        "day": "",
        "new_signatures": 0
    }]);
    const [tenRandomUsers, setTenRandomUsers] = useState([{
        "account_id": 52860,
        "organization": "",
        "certified_SMS": 0,
        "certified_email": 0,
        "created_on": "",
        "email": "",
        "person": "",
        "phone": "",
        "photo_id_certified": 0,
        "role": "",
        "status": "",
        "timestamp": 0
    }]);
    const [userCompletnessOfSignatures, setUserCompletenessOfSignatures] = useState([{
        "account_id": 0,
        "signature_id": "",
        "status": "",
        "percentage_complete": 0,
        "color": 'grey',
    }]);
    const [userStatusOfSignaturesPerDay, setUserStatusOfSignaturesPerDay] = useState([{
        "day": "",
        "status": "",
        "status_Count": 0
    }]);

    let api_signatures_expiring_soon = getApiSignaturesExpiringSoonUrl(host, token)
    let api_ranking_of_top_accounts_with_expired_signatures = getApiRankingOfTopAccountsWithExpiredSignaturesUrl(host, token, date_from, date_to)
    let api_ranking_of_top_accounts_creating_signatures = getApiRankingOfTopAccountsCreatingSignaturesUrl(host, token, date_from, date_to)
    let api_total_signatures_per_month = getApiTotalSignaturesPerMonthUrl(host, token, date_from, date_to);
    let api_ratio_of_filters = getApiRatioOfFiltersUrl(host, token, date_from, date_to);
    let api_new_signatures_per_day = getApiNewSignaturesPerDay(host, token, date_from, date_to);
    let api_ten_random_users = getApiTenRandomUsers(host, token);
    let api_user_completeness_of_signatures = getApiUserCompletenessOfSignaturesUrl(host, token, account.account_id);
    let api_user_status_of_signatures_per_day = getApiUserStatusOfSignaturesPerDay(host, token, account.account_id);

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
    }, [api_ranking_of_top_accounts_creating_signatures]);
    useEffect(() => {
        fetchTinybirdUrl(api_total_signatures_per_month, setTotalSignaturesPerMonth)
    }, [api_total_signatures_per_month]);
    useEffect(() => {
        fetchTinybirdUrl(api_new_signatures_per_day, setNewSignaturesPerDay)
    }, [api_new_signatures_per_day]);
    useEffect(() => {
        fetchTinybirdUrl(api_ten_random_users, setTenRandomUsers)
    }, []);
    useEffect(() => {
        fetchTinybirdUrl(api_user_completeness_of_signatures, setUserCompletenessOfSignatures)
    }, [api_user_completeness_of_signatures]);
    useEffect(() => {
        fetchTinybirdUrl(api_user_status_of_signatures_per_day, setUserStatusOfSignaturesPerDay)
    }, [api_user_status_of_signatures_per_day]);

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
                            <DateRangePicker
                                value={dates}
                                onValueChange={setDates}
                                enableYearPagination={false}
                                dropdownPlaceholder="Pick dates"
                                className="mt-2 mt-auto"
                                enableSelect={true}
                            />
                        </Card>
                    </Col >


                    <Col numColSpan={1} numColSpanLg={4}>
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

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card>
                            <Title>Ranking of the top accounts having expired signatures</Title>
                            <Subtitle>
                                Ranked from highest to lowest
                            </Subtitle>
                            <Flex className="mt-4">
                                <Text>
                                    <Bold>Organization</Bold>
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

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card>
                            <Title>Ratio of signatures by Date</Title>
                            <DonutChart
                                className="mt-8"
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
                    <Col numColSpan={1} numColSpanLg={3}>

                        <Card>
                            <Title>New Signatures Per Day</Title>
                            <LineChart
                                className="mt-6"
                                data={newSignaturesPerDay}
                                index="day"
                                categories={["new_signatures"]}
                                colors={["emerald"]}
                                valueFormatter={numberDataFormatter}
                                yAxisWidth={40}
                            />
                        </Card>
                    </Col>

                </Grid>

                <Divider />

                <Grid
                    numItems={1} numItemsSm={1} numItemsLg={4} className="gap-2"
                >
                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card>
                            <Title>Organization Dashboard</Title>
                        </Card>
                    </Col >

                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card >
                            <Text>Organization</Text>
                            <Select
                                value={account}
                                onValueChange={(value) => setAccount(value)}
                            >
                                {tenRandomUsers.map((account) => (
                                    <SelectItem key={account.account_id}
                                        value={account}
                                        text={account.organization}
                                    >
                                        {account.organization}
                                    </SelectItem>
                                ))}
                            </Select>
                        </Card>
                    </Col>

                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card >
                            <Text>Account Info</Text>
                            <Flex justifyContent="right" alignItems="center">
                                <Badge size="md">Org Owner: {account.person}</Badge>
                                <Badge size="md">Organization: {account.organization}</Badge>
                                <Badge size="md">Account #: {account.account_id}</Badge>
                                <Badge size="md">Email: {account.email}</Badge>
                                <Badge size="md">Phone: {account.phone}</Badge>
                                <Badge size="md">Role: {account.role}</Badge>
                                <Badge size="md">Account status: {account.status}</Badge>
                            </Flex>
                        </Card>
                    </Col>

                    <Col numColSpan={1} numColSpanLg={3}>
                        <Card>
                            <Title>Status of your signatures per day</Title>
                            <BarChart
                                className="mt-6"
                                data={userStatusOfSignaturesPerDay}
                                index="day"
                                categories={["in_queue", "ready", "signing", "completed", "expired", "canceled", "declined", "error"]}
                                colors={["blue", "red", "amber", "indigo", "rose", "cyan"]}
                                valueFormatter={numberDataFormatter}
                            />
                        </Card>
                    </Col >

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card className="mt-6">
                            <Title>Status of your signatures</Title>

                            <List>
                                {userCompletnessOfSignatures.map((item) => (
                                    <Card className="mt-6" key={item.signature_id}>
                                        <Flex>
                                            <Text>{item.percentage_complete}%</Text>
                                            <Text>{(item.signature_id).substring(0, 7)}</Text>
                                            <Text>{item.status}</Text>
                                        </Flex>
                                        <ProgressBar value={item.percentage_complete} color={item.color} className="mt-3" />
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

