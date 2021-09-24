import mercadopago from 'mercadopago';
import { ACCESS_TOKEN, BUYER_AREA_CODE, BUYER_EMAIL, BUYER_LASTNAME, BUYER_NAME, BUYER_PHONE, BUYER_STREET_NAME, BUYER_STREET_NUMBER, BUYER_ZIP_CODE, EXTERNAL_REFERENCE, INTEGRATOR_ID, WEBSITE } from './config.js';

let back_urls = {
  success: `${WEBSITE}success`,
  failure: `${WEBSITE}failure`,
  pending: `${WEBSITE}pending`
}
let items = []
let payer = {
  name: BUYER_NAME,
  surname: BUYER_LASTNAME,
  email: BUYER_EMAIL,
  phone: {
    area_code: BUYER_AREA_CODE,
    number: parseInt(BUYER_PHONE, 10)
  },
  address: {
    street_name: BUYER_STREET_NAME,
    street_number: parseInt(BUYER_STREET_NUMBER, 10),
    zip_code: BUYER_ZIP_CODE
  }
}
let payment_methods = {
  installments: 6,
  excluded_payment_methods: [{ id: 'diners' }],
  excluded_payment_types: [{ id: 'atm' }],
}
let auto_return = 'approved'
let notification_url = `${WEBSITE}webhooks`
let external_reference = EXTERNAL_REFERENCE

export const keys = {
  access_token: ACCESS_TOKEN,
  integrator_id: INTEGRATOR_ID
}
export const opts = { items, back_urls, auto_return, payer, payment_methods, notification_url, external_reference };
export default mercadopago