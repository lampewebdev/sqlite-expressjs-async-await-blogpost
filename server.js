const polka = require('polka');
const Database = require('sqlite-async');

const main = async () => {
    try {
        db = await Database.open(":memory:");
    } catch (error) {
        throw Error('can not access sqlite database');
    }
    try {
        await db.run(`
			CREATE TABLE user
			(
                firstName Text,
                lastName Text
			)
    	`);	
    } catch (error) {
        throw Error('Could not create table')
    }
    try {
        const insertString = `
            INSERT INTO user
            (firstName, lastName)
            VALUES (?,?)
        `;
        await db.run(insertString,
            "Michael",
            "Lazarski"
        );
    } catch (error) {
        throw Error('Could not insert new user');
    }
    polka()
        .get('/', async (req, res) => {
            const {firstName, lastName} = 
            await db.get(`SELECT firstName, lastName 
                         FROM user 
                         WHERE firstName LIKE ?`,
                         "%Michael%");
            res.end(`<h1>hello ${firstName} ${lastName} </h1>`);
        })
        .listen(3000, err => {
            if (err) throw err;
            console.log(`> Running on localhost:3000`);
        });
}

main();
