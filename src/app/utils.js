// utils/api.js
const getDateOrDefault = (date, defaultDate) => {
    if (date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substring(0, 10);
    } else {
        return defaultDate.toISOString().substring(0, 10);
    }
}

const getNextDay = (date) => {
    if (date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000 + 60000 * 60 * 24 - 1).toISOString().substring(0, 10);
    } else {
        return date;
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
    }
};

const percentageFormatter = (number) => `${Intl.NumberFormat("us").format(number).toString()}%`;

const numberDataFormatter = (number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

export {
    getDateOrDefault,
    getNextDay,
    validateInputToken,
    handleInputTokenChange,
    percentageFormatter,
    numberDataFormatter,
}
