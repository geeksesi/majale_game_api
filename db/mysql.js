const knex = require('knex');

const db = knex({
    client: 'mysql',
    connection: {
        host: 's7.liara.ir',
        port: '32761',
        user: 'root',
        password: '20bRQYqphdPObGd09hXfrdxG',
        database: 'majale'
    }
});


function get_season(language_id, cb) {
    db.select('*')
        .from('season')
        .where('language_id', language_id)
        .then(seasons => { cb({ ok: true, data: seasons }) })
        .catch(e => { cb({ ok: false, error: e }) })
}

function words_season(season_id, answer_language_id, cb) {
    db.select('id', 'parent_id', 'language_id', 'season_sort', 'word', 'status', 'season_id')
        .from('word')
        .where('season_id', season_id)
        .andWhereNot('status', null)
        .andWhereNot('status', 0)
        .then(question_words => {
            let count = 0;
            Object.keys(question_words).map(q_word => {
                db.select('word', 'language_id')
                    .from('word')
                    .where('parent_id', question_words[q_word].parent_id)
                    .andWhere('language_id', answer_language_id)
                    .then(answer_word => {
                        question_words[q_word].answer = answer_word[0];
                        if ((count + 1) === question_words.length) {
                            cb({ ok: true, data: question_words });
                        } else {
                            count++;
                        }
                    })
                    .catch(e => cb({ ok: false, error: e }))
            })
        })
        .catch(e => cb({ ok: false, error: e }))
}


function get_words(answer_language_id, cb){
    db.select('id', 'parent_id', 'language_id', 'season_sort', 'word', 'status', 'season_id')
    .from('word')
    .andWhereNot('status', null)
    .andWhereNot('status', 0)
    .then(question_words => {
        let count = 0;
        Object.keys(question_words).map(q_word => {
            db.select('word', 'language_id')
                .from('word')
                .where('parent_id', question_words[q_word].parent_id)
                .andWhere('language_id', answer_language_id)
                .then(answer_word => {
                    question_words[q_word].answer = answer_word[0];
                    if ((count + 1) === question_words.length) {
                        cb({ ok: true, data: question_words });
                    } else {
                        count++;
                    }
                })
                .catch(e => cb({ ok: false, error: e }))
        })
    })
    .catch(e => cb({ ok: false, error: e }))
}


function get_update_time(cb) {
    db.select()
        .from('update_archive')
        .orderBy('id', 'desc')
        .then(res => {
            cb(res[0]);
        })
        .catch(e => cb({ ok: false, error: e }))

}


function leaderboard_set(rubicka_id, xp, name = null, avatar = null, cb) {
    db.select()
        .from('leaderboard')
        .where('rubicka_id', rubicka_id)
        .then(user => {
            if (user.length < 1) {
                if (avatar === null || name === null) {
                    db('leaderboard')
                        .insert({
                            rubicka_id: rubicka_id,
                            xp: xp,
                            timestamp: Math.floor(Date.now() / 1000)
                        })
                        .then(set_res => {
                            leaderboard_get(rubicka_id, lb => cb(lb));
                        })
                        .catch(e => cb({ ok: false, error: e }))
                }
                else {
                    db('leaderboard')
                        .insert({
                            rubicka_id: rubicka_id,
                            xp: xp,
                            timestamp: Math.floor(Date.now() / 1000),
                            name: name,
                            avatar: avatar
                        })
                        .then(set_res => {
                            leaderboard_get(rubicka_id, lb => cb(lb));
                        })
                        .catch(e => cb({ ok: false, error: e }))
                }
            } else {
                if (avatar === null || name === null) {
                    db('leaderboard')
                        .where('rubicka_id', rubicka_id)
                        .update({
                            rubicka_id: rubicka_id,
                            xp: xp,
                        })
                        .then(update_res => {
                            leaderboard_get(rubicka_id, lb => cb(lb));
                        })
                        .catch(e => cb({ ok: false, error: e }));
                } else {
                    db('leaderboard')
                        .where('rubicka_id', rubicka_id)
                        .update({
                            rubicka_id: rubicka_id,
                            xp: xp,
                            name: name,
                            avatar: avatar
                        })
                        .then(update_res => {
                            leaderboard_get(rubicka_id, lb => cb(lb));
                        })
                        .catch(e => cb({ ok: false, error: e }));
                }
            }
        })
        .catch(e => cb({ ok: false, error: e }))
}


function leaderboard_get(user_id, cb) {
    let export_array = [];
    let user_data = {};
    let users_length;
    db.select()
        .from('leaderboard')
        .orderBy('xp', 'desc')
        .then(users => {
            users_length = users.length;
            for (let i = 0; i < users.length; i++) {
                if (export_array.length < 10) {
                    users[i].rank = i;
                    export_array.push(users[i]);
                }
                if (users[i].rubicka_id == user_id) {
                    users[i].rank = i;
                    users[i].rb_id = user_id;
                    user_data.ok = true;
                    user_data.data = users[i];
                    user_data.rank = (i + 1);
                }
            }
            let wait = setInterval(() => {
                if (export_array.length > 9 || (typeof users_length !== 'undefined' && export_array.length === users_length)) {
                    if (typeof user_data.ok !== 'undefined' && user_data.ok === true) {
                        clearInterval(wait);
                        cb({ ok: true, data: [...export_array], user: user_data });
                    }
                }
            }, 200);
        })
        .catch(e => cb({ ok: false, error: e }))

}

module.exports = {
    get_season,
    words_season,
    get_update_time,
    leaderboard_set,
    leaderboard_get,
    get_words
}