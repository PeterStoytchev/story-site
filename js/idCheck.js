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

function checkIfValid(data)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/checkId/`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.status != 200)
        {
            window.location.replace("/");
        }
    };

    data = JSON.stringify(data);
    xhr.send(data);
}

var authId = accessCookie("authId");
var username = accessCookie("username");

if (authId != "NULL" && username != "NULL")
{
    checkIfValid({"id": authId, "username": username});
}
else
{
    window.location.replace("/");
}
