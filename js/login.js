//@Todo: make it so that when someone with a valid authId visits this page, it redirects them to the stories page 

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
                setCookieWithExpirationDate("authId", uuid, 5 * 60);
                setCookieWithExpirationDate("username", username, 5 * 60);
                window.location.replace("/stories");
                break;

            case 409:
                console.log("a user with such username already exists");
                break;

            case 403:
                console.log("Invalid credentials");
                break;

            case 404:
                console.log("Couldnt find a user with such username");
                break;
            case 500:
                console.log("Internal server error, try again later!");
                break;
        }
    };

    data = JSON.stringify(data);
    xhr.send(data);
}

document.getElementById("EmuLogButton").addEventListener("click", (e) => {
    //@Todo: thease are here for debug purposes only, replace the with propeper input for username and password
    var username = "predictora";
    var password = "prujinata";
    
    var uuid = uuidv4();
    SendRegRequest({"username": username, "password": password, "authid": uuid}, "login", uuid, username);
});

document.getElementById("EmuRegButton").addEventListener("click", (e) => {
    //@Todo: thease are here for debug purposes only, replace the with propeper input for username and password
    var username = "predictora";
    var password = "prujinata";
    
    var uuid = uuidv4();
    SendRegRequest({"username": username, "password": password, "authid": uuid}, "reguser", uuid, username);
});