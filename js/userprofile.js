var isGenerated = false;

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

function SetUserStories(tableHolder)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/getuserstories/`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        switch (xhr.status)
        {
            case 200:
                SetTable(JSON.parse( xhr.responseText), tableHolder);
                break;

            case 404:
                tableHolder.innerHTML = "<h3>You haven't posted any stories, yet!</h3>";
                break;
            case 500:
                console.log("Internal server error, try again later!");
                break;
        }
    };

    var data = JSON.stringify({"username": username});
    xhr.send(data);
}

function SetTable(data, tableHolder)
{
    if (!isGenerated)
    {
        isGenerated = true;

        var tableHTML = "<table id='StoriesTable'> <tr> <th>Title</th> <th>Genre</th></tr>";
        for (var i =0; i < data.titles.length; i++)
        {
            tableHTML = tableHTML + "<tr> <td><a href='/stories/" + data.storyIds[i] + "/'>" + data.titles[i] + "</a></td>";
            tableHTML = tableHTML + "<td>" + data.storyTypes[i] + "</td></tr>";
        }

        tableHTML = tableHTML + "</tr></table>";

        tableHolder.innerHTML = tableHTML;
    }
}

var pageTitle = document.getElementById("PageTitle");
pageTitle.innerText = pageTitle.innerText + ", " + username;

var tableHolder = document.getElementById("TableHolder");

SetUserStories(tableHolder);