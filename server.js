const express = require('express');
const { Time } = require('./Time');
const { LeaderboardSet } = require('./Leaderboard');
const app = express();// get all todos

app.use((req, res, next) => {

	res.header("Access-Control-Allow-Origin", "*");

	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();

});

app.use(express.json());

app.get('/time/:time', Time);


app.post('/leaderboard/:user_id', LeaderboardSet);


const PORT = 5000;
app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
});