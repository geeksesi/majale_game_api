const { leaderboard_set } = require('./db/db');

function LeaderboardSet(req, res) {
	const rubicka_id = req.params.user_id;
	const xp = req.body.xp;
	const avatar = req.body.avatar || null;
	const name = req.body.name || null;
	leaderboard_set(rubicka_id, xp, name, avatar, lb => {
		res.status(200).json(lb)
	})
}

module.exports = {
	LeaderboardSet,

}