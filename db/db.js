// const word_list = require('./word_list.json');
// const season_list = require('./season_list.json');
const { get_season, words_season, get_update_time, leaderboard_set } = require('./mysql');

function db_get_data(cb) {
	let howmany_wait;
	let finished = false;
	let export_object = {
		seasons: {},
		words: {}
	};
	get_season(2, async res => {
		export_object.seasons[2] = await res.data;
		if (Array.isArray(res.data)) {
			howmany_wait = 20;
			for (let i = 0; i < res.data.length; i++) {
				const element = res.data[i];
				await words_season(element.id, 1, word => {
					export_object.words[element.id] = word.data;
				});
			}
		}
	});

	const t = setInterval(() => {
		if ((typeof howmany_wait !== 'undefined' && Object.keys(export_object.words).length >= howmany_wait)) {
			clearInterval(t);
			setTimeout(() => {
				cb(export_object);
			}, 1000);
		}
	}, 500);
}
module.exports = {
	db_get_data: db_get_data,
	get_update_time: get_update_time,
	leaderboard_set : leaderboard_set
}