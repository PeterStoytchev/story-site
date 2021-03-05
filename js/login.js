//@Todo: make it so that when someone with a valid authId visits this page, it redirects them to the stories page 

var errorField = document.getElementById("ErrorP");

function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function setCookieWithExpirationDate(cookieId, cookieValue, secondsToExpiteFromNow)
{
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * secondsToExpiteFromNow;
    now.setTime(expireTime);
    document.cookie = cookieId + "=" + cookieValue + ";expires=" + now.toUTCString() +";path=/";
}

function SendRegRequest(data, action, uuid, username)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/${action}/`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        switch (xhr.status)
        {
            case 200:
                setCookieWithExpirationDate("authId", uuid, 7 * 24 * 60 * 60);
                setCookieWithExpirationDate("username", username, 7 * 24 * 60 * 60);
                window.location.replace("/stories");
                break;

            case 409:
                errorField.innerText = "A user with such username already exists!";
                break;

            case 403:
                errorField.innerText = "Invalid credentials!";
                break;

            case 404:
                errorField.innerText = "Couldnt find a user with such username!";
                break;
            case 500:
                errorField.innerText = "Internal server error, try again later!";
                break;
        }
    };

    data = JSON.stringify(data);
    xhr.send(data);
}

document.getElementById("LoginButton").addEventListener("click", (e) => {
    var uuid = uuidv4();

    var username = document.getElementById("usernameField").value;
    var password = document.getElementById("passwordField").value;

    SendRegRequest({"username": username, "password": password, "authid": uuid}, "login", uuid, username);
});

document.getElementById("RegisterButton").addEventListener("click", (e) => {
    var uuid = uuidv4();

    var username = document.getElementById("usernameField").value;
    var password = document.getElementById("passwordField").value;

    if (!(isEmptyOrSpaces(username) && isEmptyOrSpaces(password)))
    {
        SendRegRequest({"username": username, "password": password, "authid": uuid}, "reguser", uuid, username);
    }
    else
    {
        errorField.innerText = "You need to specify a username and password!";
    }
});