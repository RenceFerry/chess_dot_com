import { Client } from 'gender-api.com-client';

const gender = new Client(process.env.GENDER_API_KEY!);

export default gender;