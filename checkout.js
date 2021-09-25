import mercadopago, { keys } from './mercadopago.js';
import { PRODUCT_ID, PRODUCT_DESCRIPTION } from './config.js';

const checkout = async (query, opts) => {
  const { title, price, image, unit } = query
  let product = {
    id: PRODUCT_ID,
    description: PRODUCT_DESCRIPTION,
    title: title,
    unit_price: parseInt(price, 10),
    image: image,
    quantity: parseInt(unit, 10)
  }
  opts.items.push(product)
  try {
    mercadopago.configure(keys)
    const data = await mercadopago.preferences.create(opts)
    return data
  } catch (err) {
    return err
  }
}

export default checkout