import express from 'express';
import exphbs from 'express-handlebars';
import checkout from './checkout.js';
import { opts } from './mercadopago.js';
import { PORT } from './config.js';

const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('assets'));
app.use('/assets', express.static(`${process.cwd()}/assets`));

app.get('/', (req, res) => {
	return res.render('home');
});

app.get('/detail', (req, res) => {
	return res.render('detail', req.query);
	// checkout(req.query, opts)
});

app.post('/notifications', (req, res) => {
	const { query: { topic } } = req
	if (topic === 'payment') { return res.send("Payment created") }
	if (topic === 'plan') { return res.send("Plan created") }
	if (topic === 'subscription') { return res.send("Subscription created") }
	if (topic === 'invoice') { return res.send("Invoice created") }
	if (topic === 'test') { return res.send("Demo") }
	return res.status(404).send('Not found')
})

app.post('/webhooks', (req, res) => {
	const { body } = req
	console.log('webhook', body)
	return res.send(body)
})

app.get('/callback', (req, res) => {
	const { query: { status, ...data } } = req
	if (status.includes('success')) { return res.render('success', data) }
	if (status.includes('pending')) { return res.render('pending', data) }
	if (status.includes('failure')) { return res.render('failure', data) }
	return res.redirect('/notfound')
})

app.get('/notfound', (req, res) => {
	return res.send('Not found')
})

app.post('/checkout', async (req, res) => {
	try {
		const { body: { init_point } } = await checkout(req.body, opts)
		return res.render('confirm', { init_point })
	} catch (err) {
		console.log(err);
		return res.send('Algo salio mal');
	}
});

app.listen(PORT);
console.log(`Server running -> PORT: ${PORT}`);