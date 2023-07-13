import { createKey } from "next/dist/shared/lib/router/router.js";
import { send_data_to_tinybird, read_tinyb_config } from "./utils/tinybird.js";
import { faker } from '@faker-js/faker';

let account_id_list = [];
let canGenerateUUID = true;
let randomInterval = faker.number.int({ min: 10, max: 50 });
let signatureID = "86ea9a31-0884-4ce6-92b4-983c4be494a6"

function generateUUID() {
    if (canGenerateUUID) {
        canGenerateUUID = false;
        setTimeout(() => canGenerateUUID = true, randomInterval); // Throttling interval is 1000ms. Change this value as per your needs.
        signatureID = faker.string.uuid();
    }
    return signatureID
}

const generateSignaturePayload = (account_id, status, signatureType, signature_id) => {
    // Types of electron signatures
    // Simple - Sign with one click or enter a PIN sent via SMS.
    // Advance(biometrics) -  Done with a pen stroke, just like signing on paper.
    // Advance(digital certificate) - The signatory uses their digital certificate, issued by third parties.
    // Qualified - The signatory uses a digital certificate issued by Signaturit.
    const since = faker.date.past({ years: 3 });
    return {
        signature_id,
        status,
        signatureType,
        since: since.toISOString().substring(0, 10),
        until: (faker.date.between({
            from: since,
            to: '2024-01-01'
        })).toISOString().substring(0, 10),
        account_id,
        created_on: (faker.date.past({ years: 3 })).toISOString().substring(0, 10),
        timestamp: Date.now(),
        uuid: faker.string.uuid(),
    }
}

const generateAccountPayload = () => {
    const status = ["active", "inactive", "pending"];
    const id = faker.number.int({ min: 10000, max: 99999 });
    account_id_list.push(id);

    return {
        account_id: id,
        organization: faker.company.name(),
        status: status[faker.number.int({ min: 0, max: 2 })],
        role: faker.person.jobTitle(),
        certified_SMS: faker.datatype.boolean(),
        phone: faker.phone.number(),
        email: faker.internet.email(),
        person: faker.person.fullName(),
        certified_email: faker.datatype.boolean(),
        photo_id_certified: faker.datatype.boolean(),
        created_on: (faker.date.between({ from: '2021-01-01', to: '2022-01-01' })).toISOString().substring(0, 10),
        timestamp: Date.now(),
    }
}

// Generates typcial dataflow  for a signature, it looks like this
// Someone creates the signature and requests for signs
// One person sings
// Other person signs
// The signature is finished (complete, expired, canceled, declined, error)
const sendMessageAtRandomInterval = async (token) => {
    setInterval(async () => {
        randomInterval = faker.number.int({ min: 10, max: 50 });
        signatureID = generateUUID();

        const statusList = ["in_queue", "ready", "signing", "completed", "expired", "canceled", "declined", "error"];
        const signatureTypeList = ["simple", "advance(biometrics)", "advance(digital certificate)", "qualified"];

        const signatureType = signatureTypeList[faker.number.int({ min: 0, max: 3 })];

        const accountPayload = generateAccountPayload();
        await send_data_to_tinybird('accounts', token, accountPayload);
        console.log('Sending account data to Tinybird');

        const accountId1 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        // status either in_queue or ready
        const status1 = statusList[faker.number.int({ min: 0, max: 1 })];
        let subscriptionPayload = generateSignaturePayload(accountId1, status1, signatureType, signatureID);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const accountId2 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        subscriptionPayload = generateSignaturePayload(accountId2, 'signing', signatureType, signatureID);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const accountId3 = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        subscriptionPayload = generateSignaturePayload(accountId3, 'signing', signatureType, signatureID);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        const finalStatus = faker.helpers.weightedArrayElement([
            { weight: 7.5, value: 'completed' },
            { weight: 1, value: 'expired' },
            { weight: 0.5, value: 'canceled' },
            { weight: 0.5, value: 'declined' },
            { weight: 0.5, value: 'error' },
        ]) // 7.5/10 chance of being completed, 1/10 chance of being expired, 0.5/10 chance of being canceled, declined or error
        subscriptionPayload = generateSignaturePayload(accountId1, finalStatus, signatureType, signatureID);
        await send_data_to_tinybird("signatures", token, subscriptionPayload);
        console.log('Sending signature data to Tinybird');

        //  Generates Historical Signature data
        const randomAccountID = account_id_list[faker.number.int({ min: 0, max: account_id_list.length - 1 })];
        const randomStatus = faker.helpers.weightedArrayElement([
            { weight: 7.5, value: 'completed' },
            { weight: 1, value: 'expired' },
            { weight: 0.5, value: 'canceled' },
            { weight: 0.5, value: 'declined' },
            { weight: 0.5, value: 'error' },
        ])
        const randomSignatureType = signatureTypeList[faker.number.int({ min: 0, max: 3 })];
        const randomSignatureID = faker.string.uuid();

        const subscriptionPayloadHistorical = generateSignaturePayload(
            randomAccountID,
            randomStatus,
            randomSignatureType,
            randomSignatureID,
        );
        await send_data_to_tinybird("signatures", token, subscriptionPayloadHistorical);
        console.log('Sending historical signature data to Tinybird');
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