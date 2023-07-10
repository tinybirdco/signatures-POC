import { send_data_to_tinybird, read_tinyb_config } from "./utils/tinybird.js";
import { faker } from '@faker-js/faker';

let account_id_list = [];

const generateSubscriptionPayload = (account_id, status, signatureType) => {
    // Types of electron signatures
    // Simple - Sign with one click or enter a PIN sent via SMS.
    // Advance(biometrics) -  Done with a pen stroke, just like signing on paper.
    // Advance(digital certificate) - The signatory uses their digital certificate, issued by third parties.
    // Qualified - The signatory uses a digital certificate issued by Signaturit.Our digital certificate is qualified.

    return {
        status,
        signatureType,
        id: faker.string.uuid(),
        since: faker.date.recent({ days: 90 }),
        until: faker.date.soon({ days: 90 }),
        data: {},
        account_id,
        created_on: faker.date.recent({ days: 120 }),
    }
}

const generateAccountPayload = () => {
    const status = ["active", "inactive", "pending"];
    const id = faker.number.int({ min: 10000, max: 99999 });
    account_id_list.push(id);

    return {
        account_id: id,
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

// Generates typcial dataflow  for a signature, it looks like this
// Someone creates the signature and requests for signs
// One person sings
// Other person signs
// The signature is finished (complete, expired, canceled, declined, error)
const sendMessageAtRandomInterval = async (token) => {
    let randomInterval = faker.number.int({ min: 10, max: 50 });

    setInterval(async () => {
        randomInterval = faker.number.int({ min: 10, max: 50 });

        const statusList = ["in_queue", "ready", "signing", "completed", "expired", "canceled", "declined", "error"];
        const signatureTypeList = ["simple", "advance(biometrics)", "advance(digital certificate)", "qualified"];

        const signatureType = signatureTypeList[faker.number.int({ min: 0, max: 3 })];

        const accountPayload = generateAccountPayload();
        await send_data_to_tinybird('accounts', token, accountPayload);
        console.log('Sending account data to Tinybird');

        const accountId1 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        // status either in_queue or ready
        const status1 = statusList[faker.number.int({ min: 0, max: 1 })];
        let subscriptionPayload = generateSubscriptionPayload(accountId1, status1, signatureType);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const accountId2 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        subscriptionPayload = generateSubscriptionPayload(accountId2, 'signing', signatureType);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const accountId3 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        subscriptionPayload = generateSubscriptionPayload(accountId3, 'signing', signatureType);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const finalStatus = faker.helpers.weightedArrayElement([
            { weight: 7.5, value: 'completed' },
            { weight: 1, value: 'expired' },
            { weight: 0.5, value: 'canceled' },
            { weight: 0.5, value: 'declined' },
            { weight: 0.5, value: 'error' },
        ]) // 7.5/10 chance of being completed, 1/10 chance of being expired, 0.5/10 chance of being canceled, declined or error
        subscriptionPayload = generateSubscriptionPayload(accountId1, finalStatus, signatureType);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');
    }, randomInterval);
}

const main = async () => {
    try {
        console.log("Sending data to Tinybird");
        const token = await read_tinyb_config("./.tinyb");

        console.log("Initial seeding of account data to Tinybird")
        for (let i = 0; i < 10; i++) {
            const accountPayload = generateAccountPayload();
            await send_data_to_tinybird('accounts', token, accountPayload);
            console.log('Sending account data to Tinybird');
        }
        console.log("Initial seeding complete");
        await sendMessageAtRandomInterval(token);
        console.log("Data sent to Tinybird");
    } catch (error) {
        console.error(error);
    }
}

await main();