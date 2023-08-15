import twilio from 'twilio';
import { config } from '../config';

const accountsid = config.get('/config/TwilioAccountSID');
const accountAuthToken = config.get('/configTwilioAuthToken');

const sendSms = async (to, body) => {
  try {
    const client = twilio(accountsid, accountAuthToken)
    to = String(to).substring(1)
    await client.messages.create({
      to: `+92${to}`,
      from: "+15094245805", // +15094245805
      body: body
    })
  } catch (err) {
    console.log(err.message);
  }
}

// sendSms()

export default sendSms