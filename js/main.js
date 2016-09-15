var currentMood;
var text;
// Get elements from DOM
var pageheader = $("#page-header")[0]; //note the [0], jQuery returns an object, so to get the html DOM object we need the first item in the object
var pagesubheader = $("#page-subheader")[0];
var pagecontainer = $("#page-container")[0];
// The html DOM object has been casted to a input element (as defined in index.html) as later we want to get specific fields that are only avaliable from an input element object
var imgSelector = $("#my-file-selector")[0];
var refreshbtn = $("#refreshbtn")[0]; //You dont have to use [0], however this just means whenever you use the object you need to refer to it with [0].
// Register button listeners
imgSelector.addEventListener("change", function () {
    pageheader.innerHTML = "Just a sec while we analyse how you feel...";
    pagesubheader.innerHTML = "Here are some encouraging words from the Bible...";
    processImage(function (file) {
        // Get emotions based on image
        sendEmotionRequest(file, function (emotionScores) {
            // Find out most dominant emotion
            currentMood = getCurrMood(emotionScores); //this is where we send out scores to find out the predominant emotion
            changeUI(); //time to update the web app, with their emotion!
            //loadSong(currentMood); // Load random song based on mood
            //Done!!
        });
    });
});

function processImage(callback) {
    var file = imgSelector.files[0]; //get(0) is required as imgSelector is a jQuery object so to get the DOM object, its the first item in the object. files[0] refers to the location of the photo we just chose.
    var reader = new FileReader();
    if (file) {
        reader.readAsDataURL(file); //used to read the contents of the file
    }
    else {
        console.log("Invalid file");
    }
    reader.onloadend = function () {
        //After loading the file it checks if extension is jpg or png and if it isnt it lets the user know.
        if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
            pageheader.innerHTML = "Please upload an image file (jpg or png).";
        }
        else {
            //if file is photo it sends the file reference back up
            callback(file);
        }
    };
}
function changeUI() {
    //Show detected mood
    pageheader.innerHTML = "Your are: " + currentMood.name; //Remember currentMood is a Mood object, which has a name and emoji linked to it. 
    pagesubheader.innerHTML = "A bible verse to encourage you is: " + getverse(scores,text);
    //Show mood emoji
    var img = $("#selected-img")[0]; //getting a predefined area on our webpage to show the emoji
    img.src = currentMood.emoji; //link that area to the emoji of our currentMood.
    img.style.display = "block"; //just some formating of the emoji's location
    //Display song refresh button
    refreshbtn.style.display = "inline";
    //Remove offset at the top
    pagecontainer.style.marginTop = "20px";
}
// Refer to http://stackoverflow.com/questions/35565732/implementing-microsofts-project-oxford-emotion-api-and-file-upload
// and code snippet in emotion API documentation
function sendEmotionRequest(file, callback) {
    $.ajax({
        url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "fdba19c6fb1345479d45a4b4046dc2c8");
        },
        type: "POST",
        data: file,
        processData: false
    })
        .done(function (data) {
        if (data.length != 0) {
            // Get the emotion scores
            var scores = data[0].scores;
            callback(scores);
        }
        else {
            pageheader.innerHTML = "Hmm, we can't detect a human face in that photo. Try another?";
        }
    })
        .fail(function (error) {
        pageheader.innerHTML = "Sorry, something went wrong. :( Try again in a bit?";
        console.log(error.getAllResponseHeaders());
    });
}
// Section of code that handles the mood
//A Mood class which has the mood as a string. 
var Mood = (function () {
    function Mood(mood, text) {
        this.mood = mood;
        this.text = name;
        this.name = mood;
        this.text = name;
        this.mood = mood;
        this.text = name;
        this.mood = mood;
        this.text = name;
    }
    return Mood;
}());
var happy = new Mood("happy", "I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world. John 16:3");
var sad = new Mood("sad", "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged. Deuteronomy 31:8");
var angry = new Mood("angry", "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires. James 1:19-20");
var neutral = new Mood("neutral", "For God is not a God of confusion but of peace 1Corinthians 14:33");
// any type as the scores values is from the project oxford api request (so we dont know the type)
function getCurrMood(scores) {
    // In a practical sense, you would find the max emotion out of all the emotions provided. However we'll do the below just for simplicity's sake :P
    if (scores.happiness > 0.4) {
        currentMood = happy;
        var element = document.getElementById("page-subheader")
        element.innerHTML="Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you. 1Thessalonians 5:16-18";
    }
    else if (scores.sadness > 0.4) {
        currentMood = sad;
        var element = document.getElementById("page-subheader")
        element.innerHTML= "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged. Deuteronomy 31:8";
    }
    else if (scores.anger > 0.4) {
        currentMood = angry;
        var element = document.getElementById("page-subheader")
        element.innerHTML= "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires. James 1:19-20";
    }
    else {
        currentMood = neutral;
        var element = documnet.getElementById("page-subheader")
        element.innerHTML = "For God is not a God of confusion but of peace 1Corinthians 14:33";
    }
    return currentMood;
} 

function getverse(scores, text) {
    if (scores.happiness > 0.4) {  
        var element = document.getElementById("page-subheader")
        element.innerHTML="Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you. 1Thessalonians 5:16-18";
    }
    else if (scores.sadness > 0.4) {
        var element = document.getElementById("page-subheader")
        element.innerHTML= "The LORD himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged. Deuteronomy 31:8";
    }
    else if (scores.anger > 0.4) {
        var element = document.getElementById("page-subheader")
        element.innerHTML= "My dear brothers and sisters, take note of this: Everyone should be quick to listen, slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires. James 1:19-20";
    }
    else {
        var element = documnet.getElementById("page-subheader")
        element.innerHTML = "For God is not a God of confusion but of peace 1Corinthians 14:33";
    }
    return text;
}
