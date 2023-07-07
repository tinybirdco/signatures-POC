"use client";

import {
    Card,
    Title,
    Grid,
    Text,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
    Bold,
    ColGrid,
    Flex,
    ProgressBar,
    BarChart,
    LineChart,
    Metric,
    Table,
    TableHead,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    TextInput,
    Select,
    SelectItem,
    MultiSelectBox,
    MultiSelectBoxItem,
    Icon
} from '@tremor/react';

import { KeyIcon, CheckCircleIcon, ArrowTrendingDownIcon, ChartBarIcon, GlobeAmericasIcon } from '@heroicons/react/24/solid';

import { useState, useEffect } from 'react';
import React from 'react';

export default function CommitDashboard() {

    const [token, setToken] = useState('');
    const [host, setHost] = useState('api.us-east.tinybird.co');
    const [sort, setSort] = useState('processed');
    const [selectedChart, setSelectedChart] = useState(1);
    const [contract, setContract] = useState([{
        "account_name": '',
        "start_dt": '',
        "end_dt": '',
        "processed": 0,
        "storage": 0
    }]);
    const [progressProcessed, setProgressProcessed] = useState([{
        "actual": 0,
        "commit": 0,
        "percent": 0
    }]);
    const [progressStorage, setProgressStorage] = useState([{
        "actual": 0,
        "commit": 0,
        "percent": 0
    }]);
    const [trendProcessed, setTrendProcessed] = useState([]);
    const [trendStorage, setTrendStorage] = useState([]);
    const [burndown, setBurndown] = useState([]);
    const [tableProcessedStorage, setTableProcessedStorage] = useState([{
        "name": '',
        "processed_tb": 0,
        "storage_tb": 0
    }]);
    const [wsFilter, setWsFilter] = useState('All');
    const [workspaces, setWorkspaces] = useState([{
        "id": '',
        "name": ''
    }])

    let apiContract = `https://${host}/v0/pipes/card_contract.json?token=${token}`
    let apiProgressProcessed = `https://${host}/v0/pipes/progress_processed.json?token=${token}&ws_param=${wsFilter}`
    let apiProgressStorage = `https://${host}/v0/pipes/progress_storage.json?token=${token}&ws_param=${wsFilter}`
    let apiTrendProcessed = `https://${host}/v0/pipes/trend_processed.json?token=${token}&ws_param=${wsFilter}`
    let apiTrendStorage = `https://${host}/v0/pipes/trend_storage.json?token=${token}&ws_param=${wsFilter}`
    let apiBurndown = `https://${host}/v0/pipes/burndown_processed.json?token=${token}&ws_param=${wsFilter}`
    let apiTableProcessedStorage = `https://${host}/v0/pipes/table_processed_storage.json?token=${token}&sort=${sort}&ws_param=${wsFilter}`
    let apiWorkspaceFilter = `https://${host}/v0/pipes/workspace_ui_filter.json?token=${token}`

    const fetchTinybirdUrl = async (fetchUrl, setState) => {
        console.log(fetchUrl);
        const data = await fetch(fetchUrl)
        const jsonData = await data.json();
        setState(jsonData.data);
    }

    useEffect(() => {
        fetchTinybirdUrl(apiContract, setContract)
    }, [apiContract]);
    useEffect(() => {
        fetchTinybirdUrl(apiProgressProcessed, setProgressProcessed)
    }, [apiProgressProcessed]);
    useEffect(() => {
        fetchTinybirdUrl(apiProgressStorage, setProgressStorage)
    }, [apiProgressStorage]);
    useEffect(() => {
        fetchTinybirdUrl(apiTrendProcessed, setTrendProcessed)
    }, [apiTrendProcessed]);
    useEffect(() => {
        fetchTinybirdUrl(apiTrendStorage, setTrendStorage)
    }, [apiTrendStorage]);
    useEffect(() => {
        fetchTinybirdUrl(apiBurndown, setBurndown)
    }, [apiBurndown]);
    useEffect(() => {
        fetchTinybirdUrl(apiTableProcessedStorage, setTableProcessedStorage)
    }, [apiTableProcessedStorage]);
    useEffect(() => {
        fetchTinybirdUrl(apiWorkspaceFilter, setWorkspaces)
    }, [apiWorkspaceFilter]);

    const numberDataFormatter = (number) => {
        return Intl.NumberFormat("us").format(number).toString();
    };

    return (
        <main className="bg-slate-50 p-6 sm:p-10">

            <Title>{contract?.[0].account_name} Organization Dashboard</Title>
            <Flex marginTop="mt-4" spaceX="space-x-6">
                <TextInput
                    value={token}
                    onChange={(event) => setToken(event.target.value)}
                    placeholder="Enter auth token"
                    icon={KeyIcon}
                    error={token.length === 0}
                />

                <Select
                    onValueChange={(value) => setHost(value)}
                    defaultValue={"api.us-east.tinybird.co"}
                >
                    <SelectItem
                        value={"api.us-east.tinybird.co"}
                        text={"US-East"} icon={GlobeAmericasIcon}
                    >
                        US-East
                    </SelectItem>

                    <SelectItem
                        value={"api.tinybird.co"}
                        text={"EU"}
                        icon={GlobeAmericasIcon}
                    >
                        EU
                    </SelectItem>
                </Select>

                <Select
                    onValueChange={(value) => setWsFilter(value)}
                    defaultValue={"All"}
                >
                    {(workspaces ?? []).map(ws =>
                        <SelectItem
                            key={ws?.id}
                            value={ws?.id}
                            text={ws?.name}
                        />
                    )}
                </Select>
            </Flex>

            <Grid numCols={3} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-4">
                <Card>
                    <Text><Bold>Enterprise Plan</Bold></Text>
                    <Text marginTop="mt-1">{contract?.[0].start_dt} - {contract?.[0].end_dt}</Text>
                    <Flex marginTop="mt-4" justifyContent='justify-start'>
                        <Icon icon={CheckCircleIcon} color="emerald" />
                        <Text ><Bold>{Intl.NumberFormat('us').format(contract?.[0].processed ?? 0)} TB</Bold> processing</Text>
                    </Flex>
                    <Flex justifyContent='justify-start'>
                        <Icon icon={CheckCircleIcon} color="emerald" />
                        <Text ><Bold>{Intl.NumberFormat('us').format(contract?.[0].storage ?? 0)} TB</Bold> storage</Text>
                    </Flex>
                </Card>
            </Grid>

            <Grid numCols={2} gapX="gap-x-6" gapY="gap-y-6" marginTop="mt-4">
                <Card>
                    <Flex alignItems='items-start'>
                        <Title>Monthly Data Processed</Title>
                        <Select defaultValue={1} onValueChange={(value) => setSelectedChart(value)} color="emerald">
                            <SelectItem value={1} text="Bar Chart" icon={ChartBarIcon} />
                            <SelectItem value={2} text="Burn Down" icon={ArrowTrendingDownIcon} />
                        </Select>
                    </Flex>
                    {selectedChart === 1 ? (
                        <BarChart
                            data={trendProcessed}
                            dataKey="month"
                            /*categories={["processed_tb","commit_tb"]}*/
                            categories={["processed_tb"]}
                            valueFormatter={numberDataFormatter}
                            colors={["emerald", "sky"]}
                            marginTop="mt-4"
                        />
                    ) : (
                        <LineChart
                            data={burndown}
                            dataKey="month"
                            categories={["remaining_tb", "commit_tb"]}
                            colors={["emerald", "sky"]}
                            valueFormatter={numberDataFormatter}
                            marginTop="mt-4"
                        />
                    )}
                </Card>
                <Card>
                    <Title>Monthly Storage</Title>
                    <BarChart
                        data={trendStorage}
                        dataKey="month"
                        /*categories={["storage_tb","commit_tb"]}*/
                        categories={["storage_tb"]}
                        valueFormatter={numberDataFormatter}
                        colors={["emerald", "sky"]}
                        marginTop="mt-7"
                    />
                </Card>
            </Grid>

            <Card hFull={true} marginTop="mt-4">
                <Flex alignItems='items-start'>
                    <Title>Consumption by Workspace</Title>
                    <Flex justifyContent='justify-end' spaceX='space-x-4'>
                        <Text>Sort by</Text>
                        <Select marginTop='mt-2' defaultValue={"processed"} onValueChange={(value) => setSort(value)} color="emerald">
                            <SelectItem value={"processed"} text="Data Processed" />
                            <SelectItem value={"storage"} text="Storage" />
                        </Select>
                    </Flex>
                </Flex>
                <Table marginTop="mt-0">
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell textAlignment="text-left">Workspace</TableHeaderCell>
                            <TableHeaderCell textAlignment="text-right">Data Processed</TableHeaderCell>
                            <TableHeaderCell textAlignment="text-right">Storage</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableProcessedStorage?.map((item) => (
                            <TableRow key={item.name}>
                                <TableCell textAlignment="text-left">{item.name}</TableCell>
                                <TableCell textAlignment="text-right">{Intl.NumberFormat('us').format(item.processed_tb)}</TableCell>
                                <TableCell textAlignment="text-right">{Intl.NumberFormat('us').format(item.storage_tb)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </main >
    );
}