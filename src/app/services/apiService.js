// services/apiService.js
const getApiIngestionRate = (host, token) =>
    `https://${host}/v0/pipes/ingestion_rate_per_second.json?token=${token}`;

const getApiRatioOfFiltersUrl = (host, token, dateFrom, dateTo) =>
    `https://${host}/v0/pipes/ratio_of_signatures_filtered_by_date.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiSignaturesExpiringSoonUrl = (host, token) =>
    `https://${host}/v0/pipes/signatures_that_will_soon_expire.json?token=${token}`;

const getApiRankingOfTopAccountsWithExpiredSignaturesUrl = (host, token, dateFrom, dateTo) =>
    `https://${host}/v0/pipes/ranking_of_top_accounts_with_expired_signatures.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiRankingOfTopAccountsCreatingSignaturesUrl = (host, token, dateFrom, dateTo) =>
    `https://${host}/v0/pipes/ranking_of_top_accounts_creating_signatures.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiTotalSignaturesPerMonthUrl = (host, token) =>
    `https://${host}/v0/pipes/total_signatures_per_month.json?token=${token}`;

const getApiNewSignaturesPerDay = (host, token, dateFrom, dateTo) => `https://${host}/v0/pipes/new_signatures_per_day.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiTenRandomUsers = (host, token) => `https://${host}/v0/pipes/ten_random_users.json?token=${token}`;

const getApiUserCompletenessOfSignaturesUrl = (host, token, account_id) =>
    `https://${host}/v0/pipes/user_completeness_of_signatures.json?account_id=${account_id}&token=${token}`;

const getApiUserStatusOfSignaturesPerDay = (host, token, dateFrom, dateTo, account_id) => `https://${host}/v0/pipes/user_status_of_signatures_per_day.json?account_id=${account_id}&token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiUserFeed = (host, token, dateFrom, dateTo, account_id) => `https://${host}/v0/pipes/user_signature_feed.json?account_id=${account_id}&token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

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

const transformUserStatusOfSignaturesPerDay = (inputJson) => {
    return inputJson.reduce((accumulator, currentValue) => {
        // Check if there's already an object for the current day
        let dayObject = accumulator.find(obj => obj.day === currentValue.day);
        if (dayObject) {
            // If it exists, add new property to it
            dayObject[currentValue.status] = currentValue.status_count;
        } else {
            // If it doesn't exist, create new object
            let newObject = {
                day: currentValue.day,
                [currentValue.status]: currentValue.status_count
            };
            accumulator.push(newObject);
        }
        return accumulator;
    }, []);
}

const fetchTinybirdUrl = async (fetchUrl, setState) => {
    console.log(fetchUrl);
    const data = await fetch(fetchUrl)
    const jsonData = await data.json();
    console.log(jsonData.data)
    switch (true) {
        case fetchUrl.includes('total_signatures_per_month'):
            setState(transformData(jsonData.data));
            break;
        case fetchUrl.includes('user_status_of_signatures_per_day'):
            setState(transformUserStatusOfSignaturesPerDay(jsonData.data));
            break;
        default:
            setState(jsonData.data);
    }
}

export {
    fetchTinybirdUrl,
    getApiIngestionRate,
    getApiRatioOfFiltersUrl,
    getApiSignaturesExpiringSoonUrl,
    getApiRankingOfTopAccountsWithExpiredSignaturesUrl,
    getApiRankingOfTopAccountsCreatingSignaturesUrl,
    getApiTotalSignaturesPerMonthUrl,
    getApiUserCompletenessOfSignaturesUrl,
    getApiNewSignaturesPerDay,
    getApiUserStatusOfSignaturesPerDay,
    getApiTenRandomUsers,
    getApiUserFeed,
}