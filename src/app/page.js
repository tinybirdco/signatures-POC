"use client";

import {
    BarChart,
    Card,
    Col,
    Title,
    Grid,
    Text,
    DonutChart,
    DateRangePicker,
    Divider,
    Legend,
    Flex,
    TextInput,
    Select,
    SelectItem,
    Subtitle,
    List,
    ListItem
} from '@tremor/react';
import Head from "next/head";
import { KeyIcon, GlobeAmericasIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

const TINYBIRD_HOST = process.env.NEXT_PUBLIC_TINYBIRD_HOST;
const TINYBIRD_TOKEN = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

export default function Dashborad() {

    const [dates, setDates] = useState({
        from: new Date(2023, 5, 1),
        to: new Date()
    });

    // const now = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    let date_from = dates.from ? new Date(dates.from.getTime() - dates.from.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : new Date(2023, 5, 1).toISOString().substring(0, 10);
    let date_to = dates.to ? new Date(dates.to.getTime() - dates.to.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString().substring(0, 10) : date_from;

    const [token, setToken] = useState(TINYBIRD_TOKEN || '');
    const [host, setHost] = useState('api.tinybird.co');
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
        "account_id": '',
        "expired_signatures": 0,
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

    let api_ratio_of_filters = `https://${host}/v0/pipes/ratio_of_signatures_filtered_by_date.json?token=${token}${date_from ? `&date_from=${date_from}` : ''}${date_to ? `&date_to=${date_to}` : ''}`;
    let api_signatures_expiring_soon = `https://${host}/v0/pipes/signatures_that_will_soon_expire.json?token=${token}`;
    let api_ranking_of_top_accounts_with_expired_signatures = `https://${host}/v0/pipes/ranking_of_top_accounts_with_expired_signatures.json?token=${token}`;
    let api_ranking_of_top_accounts_creating_signatures = `https://${host}/v0/pipes/ranking_of_top_accounts_creating_signatures.json?token=${token}`;
    let api_total_signatures_per_month = `https://${host}/v0/pipes/total_signatures_per_month.json?token=${token}`;

    const transformData = (data) => {
        // Create a hashmap for easy access and manipulation of the data
        let map = data.reduce((acc, curr) => {
            if (!acc[curr.month]) {
                acc[curr.month] = {
                    month: curr.month,
                };
            }

            // no need for the check as there's no duplicate signature type in the same month
            acc[curr.month][curr.signatureType] = curr.total_signatures;

            return acc;
        }, {});

        // Convert the hashmap back to an array
        console.log(Object.values(map))
        return Object.values(map);
    }

    const fetchTinybirdUrl = async (fetchUrl, setState) => {
        console.log(fetchUrl);
        const data = await fetch(fetchUrl)
        const jsonData = await data.json();
        console.log(jsonData.data)
        if (fetchUrl === api_total_signatures_per_month) {
            setState(transformData(jsonData.data));
        } else {
            setState(jsonData.data);
        }
    }

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

    const validateInputToken = async (inputValue) => {
        const response = await fetch(`https://${TINYBIRD_HOST}/v0/pipes?token=${inputValue}`);
        // console.log(response.status)
        return response.status === 200;
    };

    const handleInputTokenChange = async (event) => {
        const newToken = event.target.value;
        const isValid = await validateInputToken(newToken);
        if (isValid) {
            setToken(newToken);
            // console.log(newToken);
        }
    };

    const percentageFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}%`;

    const numberDataFormatter = (number) => {
        return Intl.NumberFormat("us").format(number).toString();
    };

    return (
        <>
            <Head>
                <title>Signaturit POC</title>
            </Head>
            <main className="bg-slate-50 p-6 sm:p-10">
                <Title>Signaturit Dashboard</Title>
                <Grid
                    numItems={1} numItemsSm={1} numItemsLg={4} className="gap-2"
                >
                    <Col numColSpan={1} numColSpanLg={2}>
                        <Card>
                            <Text>Token</Text>
                            <TextInput
                                value={token}
                                text="Your API token from Tinybird"
                                onChange={handleInputTokenChange}
                            // error={async (value) => !await validateInputToken(value)}
                            />
                        </Card>
                    </Col>
                    <Col numColSpan={1} numColSpanLg={2}>
                        <Card >
                            <Text>Host</Text>
                            <Select
                                value={host}
                                onValueChange={(value) => setHost(value)}
                            >
                                <SelectItem
                                    value="api.us-east.tinybird.co"
                                    text="US-East"
                                    icon={GlobeAmericasIcon}
                                >
                                    US-East
                                </SelectItem>

                                <SelectItem
                                    value="api.tinybird.co"
                                    text="EU"
                                    icon={GlobeAmericasIcon}
                                >
                                    EU
                                </SelectItem>
                            </Select>
                        </Card>
                    </Col>
                </Grid >

                <Divider />

                <Grid
                    numItems={1} numItemsSm={1} numItemsLg={4} className="gap-2"
                >
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

                    <Col numColSpan={1} numColSpanLg={4}>
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

                    <Col numColSpan={1} numColSpanLg={1}>
                        <Card className="mt-6">
                            <Title>Ranking of the top accounts having signatures expired</Title>
                            <List>
                                {top_accounts_with_expired_signatures.map((account) => (
                                    <ListItem key={account.account_id}>
                                        <span>{account.account_id}</span>
                                        <span>{account.expired_signatures}</span>
                                    </ListItem>
                                ))}
                            </List>
                            <Legend
                                className="mt-3"
                                categories={["Account ID", "Expired Signatures"]}
                                colors={["emerald", "red"]}
                            />
                        </Card>
                    </Col>

                    <Col numColSpan={1} numColSpanLg={1}>
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
                    </Col>

                </Grid>

            </main >
        </>
    );
}
