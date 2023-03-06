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
let curRotationIndex = 0;

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
    rotateLeftButton.addEventListener("click", () => {rotateVideoBy(-1)});

    let rotateRightButton = createButton("rotate_right");
    rotateRightButton.addEventListener("click", () => {rotateVideoBy(1)});

    buttonsContainer.append(rotateLeftButton, rotateRightButton);
    titleDiv.append(cssLink);
    titleDiv.append(buttonsContainer);

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

function rotateVideoBy(amount) {
    curRotationIndex = (curRotationIndex + amount) % 4;
    if(curRotationIndex < 0) curRotationIndex += 4;
    setVideoRotation(curRotationIndex);
}

function resetVideoRotation() {
    curRotationIndex = 0;
    setVideoRotation(curRotationIndex);
}

function setVideoRotation(rotationIndex = 0) { 
    if(rotationIndex >= 4 || rotationIndex < 0) console.error("rotationIndex must be 0-3");

    let video = document.getElementsByTagName("video")[0];

    let translateYAmount = (video.offsetWidth - video.offsetHeight) / 2;
    let videoTransform = "rotate(" + rotateAmounts[rotationIndex] + "deg)";

    if(rotationIndex === 1) {
        videoTransform += " translate(" + translateYAmount + "px)";
    } else if(rotationIndex === 3) {
        videoTransform += " translate(-" + translateYAmount + "px)";
    }
    video.style.transform = videoTransform;

    adjustPlayerHeight(rotationIndex);
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
            elementsToWaitFor.forEach(element => {
                switch (element.type) {
                    case ELEMENT_TYPE.ID:
                        if (!document.getElementById(element.content)) allExist = false;
                        break;
                    
                    case ELEMENT_TYPE.CLASS:
                        if (!document.getElementsByClassName(element.content).length) allExist = false;
                        break;

                    case ELEMENT_TYPE.TAG:
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
        clearInterval(waitForVideoExistencePoll);
    }
}

// Reset rotation index on new video clicked without reload
// Event name: https://stackoverflow.com/questions/34077641
document.addEventListener('yt-navigate-start', () => {
    waitForElementsAndRun(elementsToWaitFor, resetVideoRotation);
});