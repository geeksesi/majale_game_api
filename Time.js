const { db_get_data, get_update_time } = require('./db/db');

function Time(req, res) {
	get_update_time(last_update_time => {
		if (req.params.time <= last_update_time.timeStamp) {
			db_get_data(data => {
				res.status(200).json({
					success: 'true',
					message: 'need update',
					word_list: data.words,
					season_list: data.seasons
				})
			})
		} else {
			res.status(200).json({
				success: 'true',
				message: 'ur fine',
			})
		}
	})
}

module.exports = {
	Time
}