var uploadButton = document.getElementById("UploadButton");
var fileSelector = document.getElementById("FileSelector");
var storyNameField = document.getElementById("StoryNameField");
var storyType = document.getElementById("storyTypes");

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


uploadButton.addEventListener("click", (e) => {
    if (fileSelector.files.length == 0 || storyNameField.value == "") 
    {
        alert("You haven't filled out all fields correctly!");
        return;
    }

    const file = fileSelector.files[0];
    const splitFileName = file.name.split('.');
    
    if (splitFileName[splitFileName.length - 1].toLowerCase() == "txt")
    {
        const reader = new FileReader();

        reader.addEventListener('load', (event) => {
            const result = event.target.result;
        
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/storyuploader/upload", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                switch (xhr.status)
                {
                    case 200:
                        window.location.replace("/profile/");
                        break;
                }
            }

            var data = {"text": result, "storyType": storyType.value, "storyName": storyNameField.value, "author": accessCookie("username")};

            data = JSON.stringify(data);
            xhr.send(data);
        });

        reader.readAsText(file);
    }
    else
    {
        alert("Invalid file selected!");
    }
});