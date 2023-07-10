import { Card, Text, TextInput, Title, Grid, Col, Select, SelectItem } from '@tremor/react';
import { KeyIcon, GlobeAmericasIcon } from '@heroicons/react/24/solid';


export default function TinybirdAPIConfigInput({ token, host, setHost, setToken }) {

    const handleInputTokenChange = async (event) => {
        const newToken = event.target.value;
        const isValid = await validateInputToken(newToken);
        if (isValid) {
            setToken(newToken);
            // console.log(newToken);
        }
    };

    return (
        <div>
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
        </div >
    )

};