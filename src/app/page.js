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
    handleInputTokenChange,
    percentageFormatter,
    numberDataFormatter,
} from './utils';
import {
    fetchTinybirdUrl,
    getApiRatioOfFiltersUrl,
    getApiSignaturesExpiringSoonUrl,
    getApiRankingOfTopAccountsWithExpiredSignaturesUrl,
    getApiUserCompletenessOfSignaturesUrl,
    getApiNewSignaturesPerDay,
    getApiUserStatusOfSignaturesPerDay,
    getApiTenRandomUsers,
    getApiUserFeed,
} from './services/apiService';
import IngestionRate from './components/IngestionRate';
import TotalSignaturesPerMonth from './components/TotalSignaturesPerMonth';
import TopAccountsCreatingSignatures from './components/TopAccountsCreatingSignatures';
import UserFeed from './components/UserFeed';

const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST;
const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

export default function Dashboard() {

    const [dates, setDates] = useState({
        from: new Date(2023, 5, 1),
        to: new Date()
    });

    let defaultDate = new Date(2023, 5, 1);
    let defaultAccountID = 52860;
    let defaultOrganization = "Nike";
    let date_from = getDateOrDefault(dates.from, defaultDate);
    let date_to = getNextDay(dates.to) || date_from;

    const [token, setToken] = useState(TINYBIRD_TOKEN || '');
    const [host, setHost] = useState(TINYBIRD_HOST || 'api.tinybird.co');
    const [account, setAccount] = useState({
        "account_id": defaultAccountID,
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
    const [newSignaturesPerDay, setNewSignaturesPerDay] = useState([{
        "date": "",
        "current_period_signatures": 0,
        "prev_period_signatures": 0
    },]);
    const [tenRandomUsers, setTenRandomUsers] = useState([{
        "account_id": defaultAccountID,
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

    let api_signatures_expiring_soon = getApiSignaturesExpiringSoonUrl(host, token)
    let api_ranking_of_top_accounts_with_expired_signatures = getApiRankingOfTopAccountsWithExpiredSignaturesUrl(host, token, date_from, date_to)
    let api_ratio_of_filters = getApiRatioOfFiltersUrl(host, token, date_from, date_to);
    let api_new_signatures_per_day = getApiNewSignaturesPerDay(host, token, date_from, date_to);
    let api_ten_random_users = getApiTenRandomUsers(host, token);

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
        fetchTinybirdUrl(api_new_signatures_per_day, setNewSignaturesPerDay)
    }, [api_new_signatures_per_day]);
    useEffect(() => {
        fetchTinybirdUrl(api_ten_random_users, setTenRandomUsers)
    }, []);


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
                    numItems={1}
                    numItemsSm={1}
                    numItemsLg={4}
                    className="gap-2"
                >
                    <Col numColSpan={1} numColSpanLg={4}>
                        <Card>
                            <Title>Internal Signaturit Admin Dashboard</Title>
                            Ingestion rate is <IngestionRate
                                token={token}
                                host={host}
                            />
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
                            <Title>New Signatures Per Day</Title>
                            <LineChart
                                className="mt-6"
                                data={newSignaturesPerDay}
                                index="date"
                                categories={["current_period_signatures", "prev_period_signatures"]}
                                colors={["blue", "slate"]}
                                valueFormatter={numberDataFormatter}
                                yAxisWidth={40}
                            />
                        </Card>
                    </Col>

                    <TopAccountsCreatingSignatures
                        token={token}
                        host={host}
                        date_from={date_from}
                        date_to={date_to}
                    />

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
                        <Card className='container mx-auto'>
                            <Title>Ratio of signatures by Date</Title>
                            <DonutChart
                                className="mt-2"
                                label="status"
                                data={ratio_of_filters}
                                category="percentage"
                                index="status"
                                valueFormatter={percentageFormatter}
                                colors={["amber", "indigo", "rose", "cyan", "slate", "violet", "indigo", "amber", "cyan",]}
                            />
                            <Legend
                                className="mt-2"
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

                    <TotalSignaturesPerMonth
                        token={token}
                        host={host}
                        date_from={date_from}
                        date_to={date_to}
                    />

                </Grid>

                <Divider />

                <Grid
                    numItems={1}
                    numItemsSm={1}
                    numItemsLg={4}
                    className="gap-2"
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
                                defaultValue={defaultAccountID}
                                placeholder={defaultOrganization}
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
                            <Flex justifyContent="start" alignItems="baseline" className="truncate space-x-3">
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

                </Grid>

                <Divider />

                <UserFeed
                    account={account}
                    token={token}
                    host={host}
                    date_from={date_from}
                    date_to={date_to}
                />

            </main >
        </>
    );
}

