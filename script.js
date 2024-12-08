/*
File name: script.js

AP CSP Post Create Task Project: Mindmath Game
Description: This program uses HTML, JS, and CSS to create a mental math game with various modes/difficulties, as well as a player stats section and an option to export player data.

*Developer: Radhika Parkhi*

Version: 2.0
Last modified: 12/06/2024
*/

//* VARIABLES *//
// username
let username, usernameForm;
// game
let difficulty, mode, modeDesc, myAnswer, question, solution, num1, num2, num3, result;
const modeArr = document.getElementsByName("mode");
// stats
let points = 0;
let streak = 0;
let avgSpeed = 0;
let total = 0;
let start, end, elapsed;
const timesArr = [];
//session storage
const [difficultyArr, usernameArr, modeDescArr, questionArr, solutionArr, answerArr, resultArr, speedArr] = Array.from({ length: 8 }, () => []);
// icon
var iconElement = document.getElementById("icon");
iconElement.style.width = "10%";
iconElement.style.height = "10%";                                                 
// date/time
let date = new Date();
let dom = date.getDate();
let dow = date.getDay();
let month = date.getMonth();
let hour = date.getHours();
let mins = date.getMinutes();
let amPm = "a.m.";


//* EVENT LISTENERS *//
goBtn.addEventListener("click", function() {
    username = document.getElementById("usernameField").value;
    formatName(username);
});
playBtn.addEventListener("click", play);
answerBtn.addEventListener("click", answer);
hintBtn.addEventListener("click", hint);
startoverBtn.addEventListener("click", startover);
exportDataBtn.addEventListener("click", exportData);


//* OVERLAY *//
let overlay = document.getElementById("overlay");
overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
});
window.onload = () => {
    overlay.classList.remove("hidden");
}


//* DIFFICULTY *//
let upper = document.getElementById("upper");
// default
difficulty = "easy";
range.innerHTML = "Easy (1-5)";
// update label on input
let upperUnit = parseInt(upper.value);
upper.oninput = function() {
    upperUnit = this.value;
    // easy
    if(upperUnit === "5") {
        difficulty = "easy";
        range.innerHTML = "Easy (1-5)";
    }
    // medium
    else if(upperUnit === "10") {
        difficulty = "medium";
        range.innerHTML = "Medium (1-10)";
    }
    // hard
    else {
        difficulty = "hard";
        range.innerHTML = "Hard (1-15)";
    }
}


//* FUNCTIONS *//
// format name function
function formatName(username) {
    msg1.innerHTML = "";
    if(username === ""){
        msg1.innerHTML = "<i>Please enter your name</i>";
        return;
    }
    else {
        // format name
        usernameForm = username[0].toUpperCase() + (username.slice(1)).toLowerCase();
        usernameField.value = usernameForm;
        // change stats heading
        stats.innerHTML = usernameForm + "'s Stats";
        // enable/disable inputs
        usernameField.disabled = true;
        goBtn.disabled = true;
        playBtn.disabled = false;
        for(let i = 0; i < modeArr.length; i++){
            modeArr[i].disabled = false;
        }
        upper.disabled = false;
        // save to session storage
        usernameArr.push(usernameForm);
        sessionStorage.setItem("username", usernameArr);
    }
} 

// play function
function play() {
    msg3.innerHTML = "";
    score = 0;
    // choose mode
    for(let i = 0; i < modeArr.length; i++) {
        if(modeArr[i].checked) {
            mode = modeArr[i].value;
            mode = mode.toString();
        }
        modeArr[i].disabled = true;
    }
    // enable/disable inputs
    usernameField.disabled = true;
    goBtn.disabled = true;
    upper.disabled = true;
    playBtn.disabled = true;
    answerField.disabled = false;
    answerBtn.disabled = false;
    hintBtn.disabled = false;
    // gen question
    num1 = Math.floor(Math.random()*upperUnit)+1;
    num2 = Math.floor(Math.random()*upperUnit)+1;
    // div
    if(mode == "/") {
        modeDesc = "division";
        // gen question
        num3 = num1 * num2;
        question = num3 + " / " + num1;
        // gen solution
        solution = num3 / num1;
    }
    // add, sub, mul
    else {
        // gen question
        question = num1 + " " + mode + " " + num2;
        // gen solution
        // add
        if(mode == "+") {
            modeDesc = "addition";
            solution = num1 + num2;
        }
        // sub
        else if(mode == "-") {
            modeDesc = "subtraction";
            solution = num1 - num2;
        }
        // mul
        else if(mode == "*") {
            modeDesc = "multiplication";
            solution = num1 * num2;
        }
    }
    // display question & solution
    msg2.innerHTML = usernameForm + ", what is <br>" + question + " " + "= " + " ?";
    // save to session storage     
    difficultyArr.push(difficulty);
    modeDescArr.push(modeDesc);
    questionArr.push(question);
    solutionArr.push(solution);
    sessionStorage.setItem("difficulty", difficultyArr);
    sessionStorage.setItem("mode", modeDescArr);
    sessionStorage.setItem("question", questionArr);
    sessionStorage.setItem("solution", solutionArr);
    // start time
    start = Date.now();
}

// answer function
function answer() {
    // parse as integer
    var myAnswer = parseInt(document.getElementById("answerField").value);
    // save to session storage
    answerArr.push(myAnswer);
    sessionStorage.setItem("answer", answerArr);
    msg3.innerHTML = "";
    // invalid
    if(isNaN(myAnswer)) {
        msg3.innerHTML = "<i>Please type in a number<i>";
        return;
    }
    total++;
    // correct
    if (myAnswer === solution) {
        result = "correct";
        msg2.innerHTML = "Correct, " + usernameForm + "! <br>" + question + " " + "= " + " " + solution;
        // stats
        points++;
        streak++;
        // icon
        icon.style.display = "inline";
        iconElement.src = "images/icons/correct.png";
        const myTimeout = setTimeout(hideIcon, 2000);
    }
    // incorrect
    else {
        result = "incorrect";
        msg2.innerHTML = "Incorrect, " + usernameForm + "! <br>" + question + " =" + " " + solution;
        // stats
        streak = 0;
        // icon
        icon.style.display = "inline";
        iconElement.src = "images/icons/incorrect.png";
        const myTimeout = setTimeout(hideIcon, 3000);
    }
    // save to session storage
    resultArr.push(result);
    sessionStorage.setItem("result", resultArr);
    // end time
    end = Date.now();
    // call functions
    updateStats();
    reset();
}

// hint function
function hint() {
    // add
    if(mode == "+") {
        msg3.innerHTML = "<i>You have <i>" + num1 + " marker(s), and your friend gives you " + num2 + " more. How many markers do you have now?" ;
    }
    // sub
    if(mode == "-") {
        msg3.innerHTML = "<i>You have <i>" + num1 + " piece(s) of candy, and you eat " + num2 + " of them. How many pieces do you have now?" ;
    }
    // mul
    if(mode == "*") {
        msg3.innerHTML = "<i>You have <i>" + num1 + " friend(s), and each of them have " + num2 + " pennies. How many pennies do they have in total?";
    }
    // div
    if(mode == "/") {
        msg3.innerHTML = "<i>You have <i>" + num3 + " slices of pizza, and you have " + num1 + " friends. How many slices do you give to each person?" ;
    }
    // icon
    icon.style.display = "inline";
    icon.src = "images/icons/hint.png";
    const myTimeout = setTimeout(hideIcon, 2000);
}

// reset function
function reset() {
    // enable/disable inputs
    playBtn.disabled = false;
    answerField.disabled = true;
    answerBtn.disabled = true;
    hintBtn.disabled = true;
    for(let i = 0; i < modeArr.length; i++){
      modeArr[i].disabled = false;
    }
    upper.disabled = false;
    // clear answer field
    answerField.value = "";
}

// update stats function
function updateStats() {
    // total points
    pointsDisplay.innerHTML = points;
    // streak
    streakDisplay.innerHTML = streak;
    // avg speed
    if(result == "correct") {
        let elapsed = ((end - start) / 1000);
        timesArr.push(elapsed);
        let sum = 0;
        for(let i = 0; i < timesArr.length; i++) {
            sum += timesArr[i];
        }
        avgSpeed = (sum / timesArr.length).toFixed(1);
        speedDisplay.innerHTML = avgSpeed + " sec";
        // save to session storage
        speedArr.push(avgSpeed);
        sessionStorage.setItem("speed", speedArr);
    }
    // accuracy
    accuracy = (points / total) * 100;
    accuracyDisplay.innerHTML = accuracy.toFixed(0) + "%";
}

// startover function
function startover() {
    // clear username
    usernameField.value = "";
    // enable/disable inputs
    usernameField.disabled = false;
    goBtn.disabled = false;
    for(let i = 0; i < modeArr.length; i++){
        modeArr[i].disabled = true;
    }
    upper.disabled = true;
    playBtn.disabled = true;
    answerField.disabled = true;
    answerBtn.disabled = true;
    hintBtn.disabled = true;
    // clear messages
    msg1.innerHTML = "";
    msg2.innerHTML = "";
    msg3.innerHTML = "";
    // reset stats section
    stats.innerHTML = "Stats";
    points = 0;
    pointsDisplay.innerHTML = 0;
    streakDisplay.innerHTML = 0;
    speedDisplay.innerHTML = 0;
    // clear session storage
    sessionStorage.clear();
}

// hide icon function
function hideIcon() {
    icon.style.display = "none";
    return;
}

// export data function
function exportData() {
    // add timestamp
    let datetimeValue = dow + " " + month + " " + dom + " " + hour + ":" + mins + amPm;
    sessionStorage.setItem("time", datetimeValue);
    // JSON file
    sessionData = JSON.stringify(sessionStorage, null, 2);
    // blob
    let blob = new Blob([sessionData], { type: "application/json"});
    // link
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mindmath_playerdata.json";
    link.click();
    URL.revokeObjectURL(link.href);
}


//* DATE/TIME DISPLAY *//
// day of the week switch
switch(dow) {
    case 0: dow = "Sunday"; break;
    case 1: dow = "Monday"; break;
    case 2: dow = "Tuesday"; break;
    case 3: dow = "Wednesday"; break;
    case 4: dow = "Thursday"; break;
    case 5: dow = "Friday"; break;
    case 6: dow = "Saturday"; break;
}
// month switch
switch(month) {
    case 0: month = "Jan"; break;
    case 1: month = "Feb"; break;
    case 2: month = "March"; break;
    case 3: month = "April"; break;
    case 4: month = "May"; break;
    case 5: month = "June"; break;
    case 6: month = "July"; break;
    case 7: month = "Aug"; break;
    case 8: month = "Sept"; break;
    case 9: month = "Oct"; break;
    case 10: month = "Nov"; break;
    case 11: month = "Dec"; break;
}
// hours/mins
if(hour >= 12) {
    hour -= 12;
    amPm = "p.m.";
}
if(hour === 0) {
hour = 12;
}
if(mins < 10) {
    mins = "0" + mins;
}
// suffix
dom = dom.toString();
suffCheck = dom.charAt(dom.length - 1)
// 1st
if(suffCheck == 1) {
    datetime.innerHTML = dow + ", " + month + " " + dom + "st" + " " + hour + ":" + mins + " " + amPm;
}
// 2nd
else if(suffCheck == 2) {
    datetime.innerHTML = dow + ", " + month + " " + dom + "nd" + " " + hour + ":" + mins + " " + amPm;
}
// 3rd
else if(suffCheck == 3) {
    datetime.innerHTML = dow + ", " + month + " " + dom + "rd" + " " + hour + ":" + mins + " " + amPm;
}
// nth
else {
    datetime.innerHTML = dow + ", " + month + " " + dom + "th" + " " + hour + ":" + mins + " " + amPm;
}