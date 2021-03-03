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
	return "NULL";
}

var username = accessCookie("username");

var titleHeader = document.getElementById("WelcomeH");
titleHeader.innerText = titleHeader.innerText + ", " + username;

//document.getElementById("ProfileLink").href = "/profile/" + username;