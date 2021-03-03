function accessCookie(cookieName)
{
    var name = cookieName + "=";
    var allCookieArray = document.cookie.split(';');
    for(var i=0; i<allCookieArray.length; i++)
    {
        var temp = allCookieArray[i].trim();
        if (temp.indexOf(name)==0)
        return temp.substring(name.length,temp.length);
    }
}

var pageTitle = document.getElementById("PageTitle");
pageTitle.innerText = pageTitle.innerText + ", " + accessCookie("username");


var tableHolder = document.getElementById("TableHolder");

//table generation
if (false) //Todo: check if the user has written any stories
{
    tableHolder.innerHTML = "<h2>Here are your stories</h2> <table id='MainPageTable'>"
    //TODO: table generation
}
else
{
    tableHolder.innerHTML = "<h3>You haven't posted any stories, yet!</h3>";
}