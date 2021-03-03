function setCookieWithExpirationDate(cookieId, cookieValue, secondsToExpiteFromNow)
{
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * secondsToExpiteFromNow;
    now.setTime(expireTime);
    document.cookie = cookieId + "=" + cookieValue + ";expires=" + now.toUTCString() +";path=/";
}

function SendRegRequest(data, action, uuid)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/${action}/`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        switch (xhr.status)
        {
            case 200:
                console.log("got em");
                setCookieWithExpirationDate("authId", uuid, 5 * 60);
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
    console.log("sending data: " + data);
    xhr.send(data);
}

document.getElementById("EmuLogButton").addEventListener("click", (e) => {
    //@Todo: thease are here for debug purposes only, replace the with propeper input for username and password
    var username = "predictora";
    var password = "prujinata";
    
    var uuid = uuidv4();
    console.log(`DEBUG: using UUID: ${uuid}`);

    SendRegRequest({"username": username, "password": password, "authid": uuid}, "login", uuid);
});

document.getElementById("EmuRegButton").addEventListener("click", (e) => {
    //@Todo: thease are here for debug purposes only, replace the with propeper input for username and password
    var username = "predictora";
    var password = "prujinata";
    
    var uuid = uuidv4();
    console.log(`DEBUG: using UUID: ${uuid}`);

    SendRegRequest({"username": username, "password": password, "authid": uuid}, "reguser", uuid);
});