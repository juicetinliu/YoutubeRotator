console.log("running");

const ELEMENT_TYPE = {
    ID: "id",
    TAG: "tag",
    CLASS: "class"
}

let elementsToWaitFor = [
    {type: ELEMENT_TYPE.ID, content: "above-the-fold"},
    {type: ELEMENT_TYPE.TAG, content: "video"}
]

let rotateAmounts = ["0", "90", "180", "270"];
let curRotateIndex = 0;

let ytIconColor = "var(--yt-spec-text-primary)";
let ytButtonColor = "var(--yt-spec-additive-background)";

waitForElementsAndRun(elementsToWaitFor, runWorkflow);

function runWorkflow() {
    addRotationButtons();
}

function addRotationButtons() {
    let titleDiv = document.getElementById("above-the-fold").querySelector("#title");
    titleDiv.style.display = "flex";
    titleDiv.style.justifyContent = "space-between";

    let cssLink = document.createElement("link");
    cssLink.setAttribute("rel", "stylesheet");
    cssLink.setAttribute("href", "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");


    let buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "8px";

    let rotateLeftButton = createButton("rotate_left");
    rotateLeftButton.addEventListener("click", () => {rotateVideo(-1)});

    let rotateRightButton = createButton("rotate_right");
    rotateRightButton.addEventListener("click", () => {rotateVideo(1)});

    buttonsContainer.append(rotateLeftButton, rotateRightButton);
    titleDiv.append(cssLink);
    titleDiv.append(buttonsContainer);

    console.log("ADDED");
}

function createButton(iconName) {
    let button = document.createElement("button");

    button.style.backgroundColor = ytButtonColor;
    button.style.display = "flex";
    button.style.alignItems = "center";  
    button.style.color = ytIconColor;
    button.style.borderRadius = "15px";
    button.style.border = "none";
    button.style.cursor = "pointer";

    let icon = document.createElement("span");
    icon.classList.add('material-symbols-outlined');
    icon.innerHTML = iconName;
    button.append(icon);

    return button;
}

function rotateVideo(amount) {
    curRotateIndex = (curRotateIndex + amount) % 4;
    if(curRotateIndex < 0) curRotateIndex += 4;
    console.log("rotating" + curRotateIndex);

    let video = document.getElementsByTagName("video")[0];

    let translateYAmount = (video.offsetWidth - video.offsetHeight) / 2;
    let videoTransform = "rotate(" + rotateAmounts[curRotateIndex] + "deg)";

    if(curRotateIndex === 1) {
        videoTransform += " translate(" + translateYAmount + "px)";
    } else if(curRotateIndex === 3) {
        videoTransform += " translate(-" + translateYAmount + "px)";
    }
    video.style.transform = videoTransform;

    adjustPlayerHeight(curRotateIndex);
}

function adjustPlayerHeight(rotationIndex) {
    let playerWindow = document.getElementById("player-container-inner");
    let width = playerWindow.offsetWidth;

    if(rotationIndex === 1 || rotationIndex === 3) {
        playerWindow.style.height = width + "px";
        playerWindow.style.paddingTop = "0px";
    } else {
        playerWindow.style.height = "";
        playerWindow.style.paddingTop = "";
    }
}

function waitForElementsAndRun(elementsToWaitFor, callbackFunction) {
    let waitForVideoExistencePoll = setInterval(
        () => {
            let allExist = true;
            console.log("checking");
            elementsToWaitFor.forEach(element => {
                console.log(element.type)
                switch (element.type) {
                    case ELEMENT_TYPE.ID:
                        console.log(document.getElementById(element.content));
                        if (!document.getElementById(element.content)) allExist = false;
                        break;
                    
                    case ELEMENT_TYPE.CLASS:
                        console.log(document.getElementsByClassName(element.content));
                        if (!document.getElementsByClassName(element.content).length) allExist = false;
                        break;

                    case ELEMENT_TYPE.TAG:
                        console.log(document.getElementsByTagName(element.content));
                        if (!document.getElementsByTagName(element.content).length) allExist = false;
                        break;

                    default:
                        console.log("Element type is invalid: " + element.type);
                }
            });

            if (allExist) {
                cancelPoll();
                callbackFunction();
            }
        }
        , 1000)

    function cancelPoll() {
        console.log("foundit!");
        clearInterval(waitForVideoExistencePoll);
    }
}