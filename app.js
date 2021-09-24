import express from 'express';
import exphbs from 'express-handlebars';
import mercadopago, { opts, keys } from './mercadopago.js';
import { PORT, PRODUCT_ID, PRODUCT_DESCRIPTION } from './config.js';

const app = express();
mercadopago.configure(keys);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('assets'));

app.use('/assets', express.static(`${process.cwd()}/assets`));

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/detail', function (req, res) {
	res.render('detail', { ...req.query });
	console.log(req.query)
});

app.get('/notifications', function (req, res) {
	const { type } = req
	if (type === 'payment') { return res.send("Payment created") }
	if (type === 'plan') { return res.send("Plan created") }
	if (type === 'subscription') { return res.send("Subscription created") }
	if (type === 'invoice') { return res.send("Invoice created") }
	if (type === 'test') { return res.send("Demo") }
	return res.status(404).send('Not found')
})

app.post('/webhooks', function (req, res) {
	const { body } = req
	console.log('webhook', body)
	res.send(body)
})

app.get('/callback', function (req, res) {
	const { query: { status, payment_type, external_reference, collection_id } } = req
	if (status.includes('success')) {
		return res.render('success', {
			payment_type,
			external_reference,
			collection_id,
		})
	}
	if (status.includes('pending')) { return res.render('pending') }
	if (status.includes('failure')) { return res.render('failure') }
	res.redirect('/notfound')
})

app.get('/notfound', function (req, res) {
	return res.send('Not found')
})

app.post('/checkout', function (req, res) {
	const { body } = req
	let product = {
		id: PRODUCT_ID,
		description: PRODUCT_DESCRIPTION,
		title: body.title,
		unit_price: parseInt(body.price, 10),
		image: body.image,
		quantity: parseInt(body.unit, 10)
	}
	console.log(product)
	opts.items.push(product)

	mercadopago.preferences.create(opts)
		.then(function (response) {
			const { body: { init_point } } = response
			console.log(response)
			console.log(response.body)
			console.log(init_point)
			res.render('confirm', { init_point })
		}).catch(function (err) {
			console.log(err);
			res.send('Algo salio mal');
		});
});

app.listen(PORT);
console.log(`Server running -> PORT: ${PORT}`);