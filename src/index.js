import { send_data_to_tinybird, read_tinyb_config } from "./utils/tinybird.js";
import { faker } from '@faker-js/faker';

const generateSubscriptionPayload = () => {
    // Types of electron signatures
    // Simple - Sign with one click or enter a PIN sent via SMS.
    // Advance(biometrics) -  Done with a pen stroke, just like signing on paper.
    // Advance(digital certificate) - The signatory uses their digital certificate, issued by third parties.
    // Qualified - The signatory uses a digital certificate issued by Signaturit.Our digital certificate is qualified.
    const status = ["in_queue", "ready", "signing", "completed", "expired", "canceled", "declined", "error"];
    const signatureType = ["simple", "advance(biometrics)", "advance(digital certificate)", "qualified"];

    return {
        status: status[faker.number.int({ min: 0, max: 7 })],
        signatureType: signatureType[faker.number.int({ min: 0, max: 3 })],
        id: faker.string.uuid(),
        since: faker.date.recent({ days: 10 }),
        until: faker.date.soon({ days: 10 }),
        data: {},
        account_id: faker.number.int({ min: 10000, max: 12000 }),
    }
}

const generateAccountPayload = () => {
    const status = ["active", "inactive", "pending"];

    return {
        account_id: faker.number.int({ min: 10000, max: 11000 }),
        status: status[faker.number.int({ min: 0, max: 2 })],
        role: faker.person.jobTitle(),
        certified_SMS: faker.datatype.boolean(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        person: faker.person.fullName(),
        certified_email: faker.datatype.boolean(),
        photo_id_certified: faker.datatype.boolean(),
    }
}


const sendMessageAtRandomInterval = async (token) => {
    let randomInterval = Math.floor(Math.random() * 1000) + 10;

    setInterval(async () => {
        randomInterval = faker.number.int({ min: 10, max: 1000 });
        const subscriptionPayload = generateSubscriptionPayload();
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const accountPayload = generateAccountPayload();
        await send_data_to_tinybird('accounts', token, accountPayload);
        console.log('Sending account data to Tinybird');

    }, randomInterval);
}

const main = async () => {
    try {
        console.log("Sending data to Tinybird");
        const token = await read_tinyb_config("./.tinyb");
        await sendMessageAtRandomInterval(token);
        console.log("Data sent to Tinybird");
    } catch (error) {
        console.error(error);
    }
}

await main();