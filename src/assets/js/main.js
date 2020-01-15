var stage;

var question;
var paperBg;
var fontColor;
var fontText;
var score;
var click;

var colors = ['green', 'yellow', 'black', 'red', 'blue', 'cyan'];
var questions = ['Does the ^ match the word', 'Does the ^ match the word '];
var choice = ['Success', 'Failure'];
var timeout = 60000;

var scoreObj = new createjs.Text("SCORE           0", "20px Georgia", "#fff");
var timeObj = new createjs.Text("0", "20px Georgia", "#fff");

var bgBubble = new Image();
var textBubble = new Image();
var questionBg = new Image();

var rightIcon = new Image();
var rightIconGreen = new Image();
var rightIconRed = new Image();

var leftIcon = new Image();
var leftIconGreen = new Image();
var leftIconRed = new Image();

var buttonBg = new Image();


var width = 430;
var height = 680;

function getRandomChoice() {
    return choice[Math.round(Math.random())];
}

function getRandomQuestion() {
    return questions[Math.round(Math.random())];
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function millisecToTime(millisec) {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;

    return minutes + ":" + seconds;
}

function tick() {
    timeout -= 1000;
    timeObj.text = millisecToTime(timeout);
    stage.update();
    if (timeout <= 0) {
        exit()
    } else {
        setTimeout(tick, 1000);
    }
}

var callback;
var folderURL;

export function init(cFactor) {
    stage = new createjs.Stage("minigame-canvas");
    score = 0;
    click = 0;

    callback = cFactor.callback;
    folderURL = cFactor.folderURL + "assets/";

    rightIcon.src = folderURL + "img/RightIcon.png";
    rightIconGreen.src = folderURL + "img/RightIcon_green.png";
    rightIconRed.src = folderURL + "img/RightIcon_red.png";

    leftIcon.src = folderURL + "img/WrongIcon.png";
    leftIconGreen.src = folderURL + "img/WrongIcon_green.png";
    leftIconRed.src = folderURL + "img/WrongIcon_red.png";

    buttonBg.src = folderURL + "img/button_bg.png";

    bgBubble.src = folderURL + "img/background_bubble.png";
    textBubble.src = folderURL + "img/text_color_bubble.png";
    questionBg.src =  folderURL + "img/quetion.png";
    // setTimeout(exit, timeout);
    stage.removeAllChildren();
    stage.update();

    var image = new Image();
    image.src = folderURL + "img/splash.png";
    image.onload = handleSplashImage;
}

function handleSplashImage(event) {
    var image = event.target;
    var bmp = new createjs.Bitmap(image);
    bmp.scaleX = width / bmp.getBounds().width;
    bmp.scaleY = height / bmp.getBounds().height;

    stage.addChild(bmp);
    stage.update();

    setTimeout(function () {
        stage.removeAllChildren();
        var bg = new createjs.Shape();
        bg.graphics.beginFill("#3c3230")
            .drawRect(0, 0, width, height)
            .endFill();

        stage.addChild(bg);
        stage.update();

        var printer = new Image();
        printer.src = folderURL + "img/printer.png";
        printer.onload = handleBgImage;
    }, 3000)
}

function exit() {
    stage.removeAllChildren();

    var bg = new createjs.Shape();

    bg.graphics.beginFill("#dcdcdc")
        .drawRect(0, 0, width, height)
        .endFill();

    stage.addChild(bg);

    var boundryLength = width * 0.5;
    var boundary = new createjs.Shape();
    boundary.graphics.beginFill("#4c4c4c");
    boundary.graphics.drawRoundRectComplex(0, 0, boundryLength, boundryLength, 10, 10, 10, 10);
    boundary.graphics.endFill();

    var containerScore = new createjs.Container();
    var textScoreLabel = new createjs.Text("SCORE", "14px Georgia", "#cdcdcd");
    textScoreLabel.y = 70;
    textScoreLabel.x = 125 - textScoreLabel.getBounds().width / 2 - 20;

    var textScore = new createjs.Text("" + score, "16px Gill Sans Bold", "#fff");
    textScore.y = 95;
    textScore.x = 125 - textScore.getBounds().width / 2 - 20;

    var textAccuracyLabel = new createjs.Text("ACCURACY", "14px Georgia", "#cdcdcd");
    textAccuracyLabel.y = 115;
    textAccuracyLabel.x = 125 - textAccuracyLabel.getBounds().width / 2 - 20;

    var scoreText = (((score / 10) / click) * 100).toFixed(0);
    var textAccuracy = new createjs.Text(isNaN(scoreText) ? 0 : scoreText + " %", "16px Gill Sans Bold", "#fff");
    textAccuracy.y = 145;
    textAccuracy.x = 125 - textAccuracy.getBounds().width / 2 - 20;

    containerScore.addChild(boundary);
    containerScore.addChild(textScoreLabel);
    containerScore.addChild(textScore);
    containerScore.addChild(textAccuracyLabel);
    containerScore.addChild(textAccuracy);


    containerScore.x = width / 2 - boundryLength / 2;
    containerScore.y = height / 2 - boundryLength / 2;

    stage.addChild(containerScore);

    stage.update();

    setTimeout(() => {
        callback("GAME_COMPLETED", score);
    }, 4000);
}

var containerRight;
var containerLeft;

function handleOkImage(event) {
    var image = event.target;

    var bmp = new createjs.Bitmap(image);
    var scale = 0.25;
    bmp.scaleX = scale;
    bmp.scaleY = scale;

    var bmpGreen = new createjs.Bitmap(rightIconGreen);
    bmpGreen.scaleX = scale;
    bmpGreen.scaleY = scale;

    var bmpRed = new createjs.Bitmap(rightIconRed);
    bmpRed.scaleX = scale;
    bmpRed.scaleY = scale;

    containerRight = new createjs.Container();

    containerRight.y = height - (bmp.getBounds().height * bmp.scaleY) - 20;
    containerRight.x = width * 0.7;

    containerRight.addChild(bmp);

    stage.addChild(containerRight);
    stage.update();

    containerRight.addEventListener("click", function (event) {
        click++;
        if (containerLeft) {
            containerLeft.removeAllChildren();
            var wrngIcon = new createjs.Bitmap(leftIcon);
            wrngIcon.scaleX = scale;
            wrngIcon.scaleY = scale;

            containerLeft.addChild(wrngIcon);
        }

        containerRight.removeAllChildren();

        if (question === questions[0]) {
            if (fontText === fontColor) {
                score += 10;
                containerRight.addChild(bmpGreen);
            } else {
                containerRight.addChild(bmpRed);
            }
        } else {
            if (paperBg === fontText) {
                score += 10;
                containerRight.addChild(bmpGreen);
            } else {
                containerRight.addChild(bmpRed);
            }
        }
        scoreObj.text = "SCORE            " + score;
        drawPage()
    })
}

function handleCancelImage(event) {
    var image = event.target;

    var bmp = new createjs.Bitmap(image);
    var scale = 0.25;
    bmp.scaleX = scale;
    bmp.scaleY = scale;

    var bmpGreen = new createjs.Bitmap(leftIconGreen);
    bmpGreen.scaleX = scale;
    bmpGreen.scaleY = scale;

    var bmpRed = new createjs.Bitmap(leftIconRed);
    bmpRed.scaleX = scale;
    bmpRed.scaleY = scale;


    containerLeft = new createjs.Container();

    containerLeft.y = height - (bmp.getBounds().height * bmp.scaleY) - 20;
    containerLeft.x = width * 0.2;

    containerLeft.addChild(bmp);

    stage.addChild(containerLeft);
    stage.update();

    containerLeft.addEventListener("click", function (event) {
        click++;
        if (containerRight) {
            containerRight.removeAllChildren();

            var bmpLeft = new createjs.Bitmap(rightIcon);
            bmpLeft.scaleX = 0.25;
            bmpLeft.scaleY = 0.25;

            containerRight.addChild(bmpLeft);
        }


        containerLeft.removeAllChildren();
        if (question === questions[0]) {
            if (fontText !== fontColor) {
                score += 10;
                containerLeft.addChild(bmpGreen);
            } else {
                containerLeft.addChild(bmpRed);
            }
        } else {
            if (paperBg !== fontText) {
                score += 10;
                containerLeft.addChild(bmpGreen);
            } else {
                containerLeft.addChild(bmpRed);
            }
        }
        scoreObj.text = "SCORE            " + score;
        drawPage()
    })
}

function handleBgImage(event) {
    var image = event.target;
    var bmp = new createjs.Bitmap(image);
    bmp.scaleX = width / bmp.getBounds().width;
    bmp.scaleY = height / bmp.getBounds().height;

    var btnBg = new createjs.Bitmap(buttonBg);
    btnBg.scaleY = 0.25;
    btnBg.scaleX = width / btnBg.getBounds().width;
    btnBg.y = height - btnBg.getBounds().height * width / btnBg.getBounds().width + 15;

    stage.addChild(btnBg);

    tick();

    stage.addChild(bmp);
    stage.update();

    var imageOk = new Image();
    imageOk.src = folderURL + "img/RightIcon.png";
    imageOk.onload = handleOkImage;

    var imageCancel = new Image();
    imageCancel.src = folderURL + "img/WrongIcon.png";
    imageCancel.onload = handleCancelImage;

    var imageScorebg = new Image();
    imageScorebg.src = folderURL + "img/score_bg.png";
    imageScorebg.onload = handleHudBg;

    drawPage();
}

function handleHudBg(event) {
    var image = event.target;
    var bmp = new createjs.Bitmap(image);

    var containerHud = new createjs.Container();
    containerHud.addChild(bmp);
    containerHud.addChild(scoreObj);
    containerHud.addChild(timeObj);

    bmp.scaleX = (width / bmp.getBounds().width) * 0.85;
    bmp.scaleY = 0.23;
    bmp.x = 30;

    scoreObj.x = 50;
    scoreObj.y = 5;

    stage.addChild(containerHud);


    timeObj.x = width - 120;
    timeObj.y = 5;

    stage.update();
}

var container = new createjs.Container();
var textQuestion;
var bubble;

function drawPage() {
    stage.removeChild(container);
    stage.removeChild(textQuestion);
    stage.removeChild(bubble);

    question = getRandomQuestion();
    var randomChoice = getRandomChoice();

    paperBg = getRandomColor();
    fontColor = getRandomColor();

    if (randomChoice === 'Success') {
        if (question === questions[0]) {
            fontText = fontColor;
            do {
                paperBg = getRandomColor();
            } while (fontColor === paperBg)
        } else {
            fontText = paperBg;
            do {
                fontColor = getRandomColor();
            } while (fontColor === paperBg)
        }

    } else {
        if (question === questions[0]) {
            do {
                fontColor = getRandomColor();
                fontText = getRandomColor();
            } while (fontText === fontColor);
            do {
                paperBg = getRandomColor();
            } while (fontColor === paperBg)
        } else {
            do {
                paperBg = getRandomColor();
                fontText = getRandomColor();
            } while (fontText === paperBg);
            do {
                fontColor = getRandomColor();
            } while (fontColor === paperBg)
        }
    }

    var rect = new createjs.Shape();

    rect.graphics.beginFill(paperBg);
    rect.graphics.drawRect(0, 0, width * 0.48, 226);
    rect.graphics.endFill();

    container.x = width * 0.265;
    container.y = height * 0.319;

    var text = new createjs.Text(fontText, "40px Gill Sans Regular", fontColor);
    text.x = 105 - text.getBounds().width / 2;
    text.y = 105;

    bubble = new createjs.Bitmap(question === questions[0] ? textBubble : bgBubble);
    bubble.scaleX = 0.3;
    bubble.scaleY = 0.3;
    bubble.y = container.y + 230;
    bubble.x = container.x + 10;

    textQuestion = new createjs.Bitmap(questionBg);
    textQuestion.scaleX = 0.4;
    textQuestion.scaleY = 0.35;
    textQuestion.y = bubble.y + 85;
    textQuestion.x = 50;

    container.removeAllChildren();
    container.addChild(rect, text);

    stage.addChild(container);
    stage.addChild(bubble);
    stage.addChild(textQuestion);

    createjs.Tween.get(container).to({scaleY: -0.15}) // jump to the new scale properties (default duration of 0)
        .to({scaleY: 1}, 500);
    createjs.Ticker.addEventListener("tick", stage);

}
