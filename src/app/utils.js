// utils/api.js
function getDateOrDefault(date, defaultDate) {
    if (date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
    } else {
        return defaultDate.toISOString().substring(0, 10);
    }
}

function getNextDay(date) {
    if (date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString().substring(0, 10);
    } else {
        return date;
    }
}


const getApiRatioOfFiltersUrl = (host, token, dateFrom, dateTo) =>
    `https://${host}/v0/pipes/ratio_of_signatures_filtered_by_date.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiSignaturesExpiringSoonUrl = (host, token) =>
    `https://${host}/v0/pipes/signatures_that_will_soon_expire.json?token=${token}`;

const getApiRankingOfTopAccountsWithExpiredSignaturesUrl = (host, token) =>
    `https://${host}/v0/pipes/ranking_of_top_accounts_with_expired_signatures.json?token=${token}`;

const getApiRankingOfTopAccountsCreatingSignaturesUrl = (host, token) =>
    `https://${host}/v0/pipes/ranking_of_top_accounts_creating_signatures.json?token=${token}`;

const getApiTotalSignaturesPerMonthUrl = (host, token) =>
    `https://${host}/v0/pipes/total_signatures_per_month.json?token=${token}`;

const getApiNewSignaturesPerDay = (host, token, dateFrom, dateTo) => `https://${host}/v0/pipes/new_signatures_per_day.json?token=${token}${dateFrom ? `&date_from=${dateFrom}` : ''}${dateTo ? `&date_to=${dateTo}` : ''}`;

const getApiTenRandomUsers = (host, token) => `https://${host}/v0/pipes/ten_random_users.json?token=${token}`;

const getApiUserCompletenessOfSignaturesUrl = (host, token, account_id) =>
    `https://${host}/v0/pipes/user_completeness_of_signatures.json?account_id=${account_id}&token=${token}`;

const getApiUserStatusOfSignaturesPerDay = (host, token, account_id) =>
    `https://${host}/v0/pipes/user_status_of_signatures_per_day.json?account_id=${account_id}&token=${token}`;
// const getApiUserStatusOfSignaturesPerDay = (host, token, account_id) =>
//     `https://${host}/v0/pipes/user_signature_feed.json?account_id=${account_id}&token=${token}`;



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

const validateInputToken = async (host, inputValue) => {
    const response = await fetch(`https://${host}/v0/pipes?token=${inputValue}`);
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

export {
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
    validateInputToken,
    handleInputTokenChange,
    percentageFormatter,
    numberDataFormatter,
}
