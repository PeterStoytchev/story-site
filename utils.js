function InitDB(db)
{
    db.run(`CREATE TABLE IF NOT EXISTS 'users'("username" TEXT NOT NULL UNIQUE, "password" TEXT NOT NULL, "authId" INTEGER NOT NULL UNIQUE, "storyIds" TEXT);`, (err) => {
        if (err)
        {
            console.log(err);
            return;
        }
    });

    db.run(`CREATE TABLE IF NOT EXISTS 'story_index'("author_username" TEXT NOT NULL UNIQUE, "storyTitle" TEXT NOT NULL, "storyId" INTEGER NOT NULL UNIQUE);`, (err) => {
        if (err)
        {
            console.log(err);
            return;
        }
    });
}

module.exports = {InitDB};