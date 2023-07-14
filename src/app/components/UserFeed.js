import {
    Card,
    Flex,
    Grid,
    Text,
    Badge,
    Subtitle,
} from '@tremor/react'; import React, { useEffect, useState } from 'react';
import { fetchTinybirdUrl, getApiUserFeed } from '../services/apiService';

const UserFeed = ({ account, token, host, date_from, date_to }) => {

    const [user_feed, setUserFeed] = useState([{
        "signature_id": "",
        "signatureType": "",
        "signature_created_on": "",
        "since": "",
        "until": "",
        "signing_status": "",
        "signing_timestamp": 0,
        "signing_account_id": 0,
        "signing_email": "",
        "uuid": ""
    }]);

    let api_user_feed = getApiUserFeed(host, token, date_from, date_to, account.account_id);

    useEffect(() => {
        fetchTinybirdUrl(api_user_feed, setUserFeed)
    }, [api_user_feed]);

    return (
        <Grid numItemsSm={1} numItemsLg={1} className="gap-4">
            {user_feed.map((item) => (
                <Card key={item.uuid}>
                    <Text>{item.signing_email}</Text>
                    <Flex justifyContent="space-between" alignItems="baseline" className="truncate space-x-3">
                        <Text className="truncate">{item.signatureType}</Text>
                        <Subtitle>{item.signature_id}</Subtitle>
                    </Flex>
                    <Flex justifyContent="start" className="space-x-2 mt-4">
                        <Badge>Status: {item.signing_status}</Badge>
                        <Flex justifyContent="start" className="space-x-1 truncate">
                            <Text className="truncate">Valid from: {item.since} to {item.until}</Text>
                        </Flex>
                    </Flex>
                </Card>
            ))}
        </Grid>
    )
    // render the Grid component here
};

export default UserFeed;