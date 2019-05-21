const sqlite3 = require('sqlite3').verbose();


let db = new sqlite3.Database('./data.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        console.error(`${err.message}`);
    else
        console.log(`\nDatabase Connected\n`);
});


module.exports.readURL = async () => {
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            let url = "";

            let query = `SELECT * FROM token;`;
            db.all(query, (err, rows) => {
                if (err)
                    reject(err);
                else {
                    url = rows[0].authorized_url;
                    url = url.replaceAll(" ","\%20");
                    resolve(url);
                }
            });
        }, 1000);
    });

};

module.exports.updateURL = async (url) => {
    let newUrl = url;
    return new Promise(async (resolve, reject) => {
        setTimeout(() => {
            let url = "";

            let query = `UPDATE token SET authorized_url = '${newUrl}' WHERE id = 1;`;
            db.run(query, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve(url);
                }
            });
        }, 1000);
    });

};

String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};



