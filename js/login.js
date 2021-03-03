function setCookieWithExpirationDate(cookieId, cookieValue, secondsToExpiteFromNow)
{
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 1000 * secondsToExpiteFromNow;
    now.setTime(expireTime);
    document.cookie = cookieId + "=" + cookieValue + ";expires=" + now.toUTCString() +";path=/";
}

function SendRegRequest(data)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/reguser/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) 
        {
            var json = JSON.parse(xhr.responseText);
            if (json.code == 200)
            {
                console.log("got em");
            }
        }
    };

    data = JSON.stringify(data);
    console.log("sending data: " + data);
    xhr.send(data);
}

document.getElementById("EmuLogButton").addEventListener("click", (e) => {
    var uuid = uuidv4();
    setCookieWithExpirationDate("authId", uuid, 5 * 60);
    console.log(`DEBUG: using UUID: ${uuid}`);

    //update the DB with the new ID
});

document.getElementById("EmuRegButton").addEventListener("click", (e) => {
    //@Todo: thease are here for debug purposes only, replace the with propeper input for username and password
    var username = "predictora";
    var password = "prujinata";
    
    var uuid = uuidv4();
    setCookieWithExpirationDate("authId", uuid, 5 * 60);
    console.log(`DEBUG: using UUID: ${uuid}`);

    SendRegRequest({"username": username, "password": password, "authid": uuid});
});