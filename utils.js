function InitDB(db)
{
    db.run(`CREATE TABLE IF NOT EXISTS 'users'("username" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "authId" INTEGER NOT NULL UNIQUE);`, (err) => {
        if (err)
        {
            console.log(err);
            return;
        }
    });
}

module.exports = {InitDB};