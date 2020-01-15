import React from "react";

export default class App extends React.Component {


    componentDidMount() {
        const script = document.createElement("script");

        script.src = "https://code.createjs.com/1.0.0/createjs.min.js";
        script.onload = () => {
            let stage;

            let question;
            let paperBg;
            let fontColor;
            let fontText;
            let score;
            let click;

            const colors = ['green', 'yellow', 'black', 'red', 'blue', 'cyan'];
            const questions = ['Does the ^ match the word', 'Does the ^ match the word '];
            const choice = ['Success', 'Failure'];
            let timeout = 60000;

            const scoreObj = new createjs.Text("SCORE           0", "20px Georgia", "#fff");
            const timeObj = new createjs.Text("0", "20px Georgia", "#fff");

            const bgBubble = new Image();
            const textBubble = new Image();
            const questionBg = new Image();

            const rightIcon = new Image();
            const rightIconGreen = new Image();
            const rightIconRed = new Image();

            const wrongIcon = new Image();
            const wrongIconGreen = new Image();
            const wrongIconRed = new Image();

            const buttonBg = new Image();


            const width = 430;
            const height = window.innerHeight;

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
                let seconds = (millisec / 1000).toFixed(0);
                const minutes = Math.floor(seconds / 60);

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

            let callback;
            let folderURL;

            function init(cFactor) {
                stage = new createjs.Stage("minigame-canvas");
                score = 0;
                click = 0;

                callback = cFactor.callback;
                folderURL =  "assets/colormatch/";

                rightIcon.src = folderURL + "img/RightIcon.png";
                rightIconGreen.src = folderURL + "img/RightIcon_green.png";
                rightIconRed.src = folderURL + "img/RightIcon_red.png";

                wrongIcon.src = folderURL + "img/WrongIcon.png";
                wrongIconGreen.src = folderURL + "img/WrongIcon_green.png";
                wrongIconRed.src = folderURL + "img/WrongIcon_red.png";

                buttonBg.src = folderURL + "img/button_bg.png";

                bgBubble.src = folderURL + "img/background_bubble.png";
                textBubble.src = folderURL + "img/text_color_bubble.png";
                questionBg.src = folderURL + "img/quetion.png";
                // setTimeout(exit, timeout);
                stage.removeAllChildren();
                stage.update();

                const image = new Image();
                image.src = folderURL + "img/splash.png";
                image.onload = handleSplashImage;
            }

            function handleSplashImage(event) {
                const image = event.target;
                const bmp = new createjs.Bitmap(image);
                bmp.scaleX = width / bmp.getBounds().width;
                bmp.scaleY = height / bmp.getBounds().height;

                stage.addChild(bmp);
                stage.update();

                setTimeout(function () {
                    stage.removeAllChildren();
                    const bg = new createjs.Shape();
                    bg.graphics.beginFill("#3c3230")
                        .drawRect(0, 0, width, height)
                        .endFill();

                    stage.addChild(bg);
                    stage.update();

                    const printer = new Image();
                    printer.src = folderURL + "img/printer.png";
                    printer.onload = handleBgImage;
                }, 3000)
            }

            function exit() {
                stage.removeAllChildren();

                const bg = new createjs.Shape();

                bg.graphics.beginFill("#dcdcdc")
                    .drawRect(0, 0, width, height)
                    .endFill();

                stage.addChild(bg);

                const boundryLength = width * 0.5;
                const boundary = new createjs.Shape();
                boundary.graphics.beginFill("#4c4c4c");
                boundary.graphics.drawRoundRectComplex(0, 0, boundryLength, boundryLength, 10, 10, 10, 10);
                boundary.graphics.endFill();

                const containerScore = new createjs.Container();
                const textScoreLabel = new createjs.Text("SCORE", "14px Georgia", "#cdcdcd");
                textScoreLabel.y = 70;
                textScoreLabel.x = 125 - textScoreLabel.getBounds().width / 2 - 20;

                const textScore = new createjs.Text("" + score, "16px Gill Sans Bold", "#fff");
                textScore.y = 95;
                textScore.x = 125 - textScore.getBounds().width / 2 - 20;

                const textAccuracyLabel = new createjs.Text("ACCURACY", "14px Georgia", "#cdcdcd");
                textAccuracyLabel.y = 115;
                textAccuracyLabel.x = 125 - textAccuracyLabel.getBounds().width / 2 - 20;

                const scoreText = (((score / 10) / click) * 100).toFixed(0);
                const textAccuracy = new createjs.Text(isNaN(scoreText) ? 0 : scoreText + " %", "16px Gill Sans Bold", "#fff");
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

            let containerRight;
            let containerLeft;

            function handleOkImage(event) {

                const bmp = new createjs.Bitmap(rightIcon);
                const scale = 0.25;
                bmp.scaleX = scale;
                bmp.scaleY = scale;

                const bmpGreen = new createjs.Bitmap(rightIconGreen);
                bmpGreen.scaleX = scale;
                bmpGreen.scaleY = scale;

                const bmpRed = new createjs.Bitmap(rightIconRed);
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
                        const wrngIcon = new createjs.Bitmap(wrongIcon);
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
                            score -= 10;
                        }
                    } else {
                        if (paperBg === fontText) {
                            score += 10;
                            containerRight.addChild(bmpGreen);
                        } else {
                            containerRight.addChild(bmpRed);
                            score -= 10;
                        }
                    }
                    scoreObj.text = "SCORE            " + score;
                    drawPage()
                })
            }

            function handleCancelImage(event) {

                const bmp = new createjs.Bitmap(wrongIcon);
                const scale = 0.25;
                bmp.scaleX = scale;
                bmp.scaleY = scale;

                const bmpGreen = new createjs.Bitmap(wrongIconGreen);
                bmpGreen.scaleX = scale;
                bmpGreen.scaleY = scale;

                const bmpRed = new createjs.Bitmap(wrongIconRed);
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

                        const bmpLeft = new createjs.Bitmap(rightIcon);
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
                            score -= 10;
                        }
                    } else {
                        if (paperBg !== fontText) {
                            score += 10;
                            containerLeft.addChild(bmpGreen);
                        } else {
                            containerLeft.addChild(bmpRed);
                            score -= 10;
                        }
                    }
                    scoreObj.text = "SCORE            " + score;
                    drawPage()
                })
            }

            function handleBgImage(event) {
                const image = event.target;
                const bmp = new createjs.Bitmap(image);
                bmp.scaleX = width / bmp.getBounds().width;
                bmp.scaleY = height / bmp.getBounds().height;

                const btnBg = new createjs.Bitmap(buttonBg);
                btnBg.scaleY = 0.25;
                btnBg.scaleX = width / btnBg.getBounds().width;
                btnBg.y = height - btnBg.getBounds().height * width / btnBg.getBounds().width + 15;

                stage.addChild(btnBg);

                tick();

                stage.addChild(bmp);
                stage.update();

                const imageOk = new Image();
                imageOk.src = folderURL + "img/RightIcon.png";
                imageOk.onload = handleOkImage;

                const imageCancel = new Image();
                imageCancel.src = folderURL + "img/WrongIcon.png";
                imageCancel.onload = handleCancelImage;

                const imageScorebg = new Image();
                imageScorebg.src = folderURL + "img/score_bg.png";
                imageScorebg.onload = handleHudBg;

                drawPage();
            }

            function handleHudBg(event) {
                const image = event.target;
                const bmp = new createjs.Bitmap(image);

                const containerHud = new createjs.Container();
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

            const container = new createjs.Container();
            let textQuestion;
            let bubble;

            function drawPage() {
                stage.removeChild(container);
                stage.removeChild(textQuestion);
                stage.removeChild(bubble);

                question = getRandomQuestion();
                const randomChoice = getRandomChoice();

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

                const rect = new createjs.Shape();

                rect.graphics.beginFill(paperBg);
                rect.graphics.drawRect(0, 0, width * 0.48, 226);
                rect.graphics.endFill();

                container.x = width * 0.265;
                container.y = height * 0.319;

                const text = new createjs.Text(fontText, "40px Gill Sans Regular", fontColor);
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

            init(this.props.cFactor);
        }

        document.body.appendChild(script);
    }

    render() {
        return (
            <div>
                <canvas id={'minigame-canvas'} width={430} height={680} style={{margin: 'auto', display: 'block'}}/>
            </div>
        )
    }
}
