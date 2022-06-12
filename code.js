let pageNum = 1;

// canvas variables
let canvas;
let toolbar;
let ctx;
let lineWidth = 5;
let canvasOffsetX;
let canvasOffsetY;
let canvasPNG;

let visited = 0;
let currScreen;
let userArr;
let succesLength = 0;


const PRACTICE_TWO_ANSWER_NUM = 5;
const VW_CANVAS_WIDTH = 80;
const VH_CANVAS_HEIGHT = 55;
const EGGS = ["שטיפה", "בית", "הזזה", "בקיעה"];
const textArr = [
    {
        "title": "שטיפת הביצה",
        "text": `הדבר הראשון שנעשה אחרי שהביצה מוטלת הוא לשטוף אותה.
    חשוב מאוד לשטוף את הביצה כדי להוריד ממנה חרקים שאולי נצמדו אליה. \n את השטיפה נעשה בתוך אמבט בטמפרטורה של 20 מעלות צלסיוס ואחריה ננגב את הביצה במגבת יבשה.
    `},
    {
        "title": "בניית בית לביצה",
        "text": `<p>הביצים שלנו מאוד בררניות, ויש להן דרישות מיוחדות לבית שלהן:</p>
    <ul>
    <li>הבית חייב להיות בצבע ורוד</li>
    <li>הגג צריך להיות בצבע סגול</li>
    <li>הדלת צריכה להיות בצבע אדום</li>
    <ul>
    `},
    {
        "title": "הזזה",
        "text": `<ol>
    <li>נשים כפפות</li>
    <li>נניח את הביצה על משטח מרופד בצמר גפן</li>
    <li>נרים את המשטח בזהירות לגובה של 2 ס"מ</li>
    <li>נעביר את המשטח למקום שבו אנחנו רוצים לשים את הביצה</li>
    <li>נוריד את הביצה מהמשטח</li>
    </ol>
    `},
    {
        "title": "בקיעה",
        "text": `אם פעלתם לפי כל השלבים שאמרנו, אחרי כחודש הביצה שלכם תבקע.
    את הגוזל שיצא נכתוב ברשימת החיות בפינת הליטוף ונשלח הודעה לאחראי על התרנגולות.
    `},
]
const PRACTICE_ONE_ANSWERS = [0, 0, 0];
const PRACTICE_ONE_ANSWER_NUM = 4;

window.addEventListener("load", (event) => {
    document.getElementById("symbols").addEventListener("click", showAbout);
    document.getElementById("next").addEventListener("click", nextPage);
});

const showAbout = (event) => {
    if (event.target.classList.contains("sym")) {
        document.getElementById("symbols").removeEventListener("click", showAbout);
        document.getElementById("not-about").style.display = "none";
        document.getElementById("about").style.display = "block";
        document.getElementById("close").addEventListener("click", closeAbout);
        document.getElementById("symbols").addEventListener("click", closeAbout);
    }
}

const closeAbout = (event) => {
    if (event.target.classList.contains("sym") || event.currentTarget.id === "close") {
        document.getElementById("not-about").style.display = "block";
        document.getElementById("about").style.display = "none";
        document.getElementById("symbols").removeEventListener("click", closeAbout);
        document.getElementById("symbols").addEventListener("click", showAbout);
        document.getElementById("close").removeEventListener("click", closeAbout);
    }
}

const nextPage = (event) => {
    document.getElementById(`page${pageNum}`).style.display = "none";
    pageNum++;
    if (pageNum === 2) {
        document.getElementById("next").style.display = "none";
        document.getElementById("chicken-animation").addEventListener("animationend", (event) => {
            document.getElementById("next").style.display = "block";
            document.getElementById("next").innerText = "בואו נמשיך!";
            nextPage()
        });
    } else if (pageNum === 4) {
        startCanvas();
    } else if (pageNum === 5) {
        createMap();
        return;
    }
    document.getElementById(`page${pageNum}`).style.display = "block";
}

// canvas code
const startCanvas = () => {
    canvas = document.getElementById('drawing-board');
    document.getElementById("page4").style.visibility = "visible";
    document.getElementById("drawing-warpper").style.width = `${VW_CANVAS_WIDTH}vw`;
    canvas.style.backgroundColor = "white";
    canvasPNG = canvas.toDataURL("image/png", 0.1);
    document.getElementById("egg-image").style.display = "block";
    document.getElementById("egg-image").setAttribute("src", canvasPNG);
    document.getElementById("egg-image").style.backgroundColor = "white";
    ctx = canvas.getContext('2d');
    canvas.width = (window.innerWidth * VW_CANVAS_WIDTH) / 100;
    canvas.height = (window.innerHeight * VH_CANVAS_HEIGHT) / 100;
    window.addEventListener("resize", (event) => {
        ctx.save();
        canvas.width = (window.innerWidth * VW_CANVAS_WIDTH) / 100;
        canvas.height = (window.innerHeight * VH_CANVAS_HEIGHT) / 100;
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = canvasPNG;
        ctx.restore();
    });
    handleToolbar();
    canvas.addEventListener("touchstart", startDrawing);
};

const handleToolbar = () => {
    let colorArr = document.getElementsByClassName("color");
    // document.getElementById("stroke").style.backgroundColor = colorArr[0].value;
    // for (let index = 0; index < colorArr.length; index++) {
    //     colorArr[index].style.backgroundColor = colorArr[index].value;
    //     if (colorArr[index].value === "black" || colorArr[index].value === "purple" || colorArr[index].value === "blue") {
    //         colorArr[index].style.color = "white";
    //     }
    // }
    toolbar = document.getElementById('toolbar');
    toolbar.style.padding = `10px 0`;
    toolbar.style.width = `${VW_CANVAS_WIDTH}vw`;
    document.getElementById("clear").addEventListener("click", (event) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvasPNG = canvas.toDataURL("image/png", 0.1);
        document.getElementById("egg-image").setAttribute("src", canvasPNG);
    });
    toolbar.addEventListener("input", changePen);
}

const changePen = (event) => {
    if (event.target.id === "lineWidth") {
        lineWidth = event.target.value;
    } else if (event.target.id === "stroke") {
        let currColor = event.target.value;
        ctx.strokeStyle = currColor;
        // document.getElementById("stroke").style.backgroundColor = currColor;
        // if (event.target.value === "black" || currColor === "purple" || currColor === "blue") {
        //     event.target.style.color = "white";
        // } else {
        //     event.target.style.color = "black";
        // }
    }
}

const startDrawing = (event) => {
    event.preventDefault();
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);
}

const draw = (event) => {
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    let offsets = canvas.getBoundingClientRect()
    canvasOffsetX = offsets.x;
    canvasOffsetY = offsets.y;
    for (let i = 0; i < event.touches.length; i++) {
        ctx.lineTo(event.changedTouches[i].pageX - canvasOffsetX, event.changedTouches[i].pageY - canvasOffsetY);
        ctx.stroke();
    }
    canvasPNG = canvas.toDataURL("image/png", 0.1);
    document.getElementById("egg-image").setAttribute("src", canvasPNG);
}

const stopDrawing = (event) => {
    canvas.removeEventListener("touchmove", draw);
    ctx.beginPath();
}

// Map
const createMap = () => {
    document.getElementById("page4").style.visibility = "hidden"
    document.getElementById("next").removeEventListener("click", nextPage);
    let egg;
    for (let i = 0; i < EGGS.length; i++) {
        egg = document.createElement("div");
        egg.style.backgroundImage = 'url("assets/media/unvisitedEgg.png")';
        egg.classList = `egg egg-${i}`;
        egg.innerText = EGGS[i];
        egg.setAttribute("id", `screen${i}`);
        document.getElementById("map").appendChild(egg);
    }
    showMap();
}

const showMap = () => {
    document.getElementById("next").style.display = "none";
    document.getElementById("egg-image").style.display = "none";
    if (visited < 4) {
        for (let practiceCounter = 0; practiceCounter < 3; practiceCounter++) {
            document.getElementById(`practice${practiceCounter}`).style.display = "none";
        }
        document.getElementById("symbols").style.display = "none";
        document.getElementById("map").style.display = "block";
        document.getElementById("body").style.backgroundImage = 'url("assets/media/grass.jpg")';
        document.getElementById(`screen${visited}`).style.backgroundImage = 'url("assets/media/egg.png")';
        document.getElementById(`screen${visited}`).classList.add("glow");
        document.getElementById(`screen${visited}`).addEventListener("click", moveToScreen);
    } else {
        document.getElementById("finish").style.display = "block";
        document.getElementById("body").style.backgroundColor = 'rgb(101, 107, 187)';
        document.getElementById("exit").addEventListener("click", () => {
            window.open("", "_self");
            window.close();
        })
    }
}

const moveToScreen = (event) => {
    currScreen = Number(event.currentTarget.id[6]);
    document.getElementById("next").style.display = "block";
    document.getElementById("next").removeEventListener("click", showMap);
    document.getElementById("next").addEventListener("click", moveToPractice);
    document.getElementById("map").style.display = "none";
    document.getElementById("body").style.backgroundImage = "none";
    document.getElementById("egg-image").style.display = "block";
    document.getElementById("symbols").style.display = "flex";
    document.getElementById('screen').style.display = "block";
    document.getElementById("screen-text").innerHTML = textArr[currScreen].text;
    document.getElementById("screen-title").innerText = textArr[currScreen].title;
    visited = Math.max(currScreen + 1, visited);
}

const moveToPractice = () => {
    document.getElementById("screen").style.display = "none";
    if (currScreen === 3) {
        showMap();
    } else {
        document.getElementById(`practice${currScreen}`).style.display = "block";
        document.getElementById("egg-image").style.display = "none";
        document.getElementById("next").style.backgroundColor = "gray";
        document.getElementById("next").removeEventListener("click", moveToPractice);
        window[`handlePractice${currScreen}`]();
    }

}


// Practice zero
var handlePractice0 = () => {
    document.getElementById("practice0").innerHTML = `<h1 class="practice-title">מחקו את הלכלוך מהביצה!</h1>
    <div class="scratch-container" id="scratch-container">
    <canvas class="sCanvas" id="sCanvas" width="300" height="300"></canvas>
    <img src="" alt="egg" id="innerImage" class="innerImage">`;
    manageScratch();
}

var manageScratch = function () {
    'use strict';
    var isDrawing, lastPoint;
    var sContainer = document.getElementById('scratch-container'),
        sCanvas = document.getElementById('sCanvas'),
        ctx = sCanvas.getContext('2d');
    sCanvas.width = (window.innerWidth * VW_CANVAS_WIDTH) / 100;
    sCanvas.height = (window.innerHeight * VH_CANVAS_HEIGHT) / 100;
    var sCanvasWidth = sCanvas.width,
        sCanvasHeight = sCanvas.height,
        sImage = new Image(sCanvasWidth, sCanvasHeight),
        brush = new Image();

    sImage.src = "./assets/media/dirtyEgg.png";
    sImage.onload = function () {
        ctx.drawImage(sImage, -40, -10, sCanvasWidth + 100, sCanvasHeight + 10);
        document.getElementById('innerImage').style.visibility = 'visible';
        document.getElementById('innerImage').style.width = `${sCanvasWidth}px`;
        document.getElementById('innerImage').style.height = `${sCanvasHeight}px`;
        document.getElementById('innerImage').src = canvasPNG;
    };
    brush.src = 'data:image/png;base64,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';
    sContainer.style.width = `${sCanvasWidth}px`;
    sContainer.style.height = `${sCanvasHeight}px`;
    sCanvas.addEventListener('mousedown', handleMouseDown, false);
    sCanvas.addEventListener('touchstart', handleMouseDown, false);
    sCanvas.addEventListener('mousemove', handleMouseMove, false);
    sCanvas.addEventListener('touchmove', handleMouseMove, false);
    sCanvas.addEventListener('mouseup', handleMouseUp, false);
    sCanvas.addEventListener('touchend', handleMouseUp, false);

    function distanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    function angleBetween(point1, point2) {
        return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    }

    // Only test every `stride` pixel. `stride`x faster,
    // but might lead to inaccuracy
    function getFilledInPixels(stride) {
        if (!stride || stride < 1) { stride = 1; }

        var pixels = ctx.getImageData(0, 0, sCanvasWidth, sCanvasHeight),
            pdata = pixels.data,
            l = pdata.length,
            total = (l / stride),
            count = 0;

        // Iterate over all pixels
        for (var i = count = 0; i < l; i += stride) {
            if (parseInt(pdata[i]) === 0) {
                count++;
            }
        }

        return Math.round((count / total) * 100);
    }

    function getMouse(e, sCanvas) {
        var offsetX = 0, offsetY = 0, mx, my;

        if (sCanvas.offsetParent !== undefined) {
            do {
                offsetX += sCanvas.offsetLeft;
                offsetY += sCanvas.offsetTop;
            } while ((sCanvas = sCanvas.offsetParent));
        }

        mx = (e.pageX || e.touches[0].clientX) - offsetX;
        my = (e.pageY || e.touches[0].clientY) - offsetY;

        return { x: mx, y: my };
    }

    function handlePercentage(filledInPixels) {
        filledInPixels = filledInPixels || 0;
        if (filledInPixels > 90) {
            if (sCanvas.parentNode) {
                sCanvas.parentNode.removeChild(sCanvas);
            } else {
                document.getElementById("next").addEventListener("click", showMap);
                document.getElementById("next").style.backgroundColor = "rgb(76, 39, 25)";
            }
        }
    }

    function handleMouseDown(e) {
        isDrawing = true;
        lastPoint = getMouse(e, sCanvas);
    }

    function handleMouseMove(e) {
        if (!isDrawing) { return; }

        e.preventDefault();

        var currentPoint = getMouse(e, sCanvas),
            dist = distanceBetween(lastPoint, currentPoint),
            angle = angleBetween(lastPoint, currentPoint),
            x, y;

        for (var i = 0; i < dist; i++) {
            x = lastPoint.x + (Math.sin(angle) * i) - 25;
            y = lastPoint.y + (Math.cos(angle) * i) - 25;
            ctx.globalCompositeOperation = 'destination-out';
            ctx.drawImage(brush, x, y);
        }

        lastPoint = currentPoint;
        handlePercentage(getFilledInPixels(32));
    }

    function handleMouseUp(e) {
        isDrawing = false;
    }

};

// First practice
var handlePractice1 = () => {
    document.getElementById("house").setAttribute("src", `assets/media/house/house${Math.floor(Math.random() * PRACTICE_ONE_ANSWER_NUM)}.svg`);
    document.getElementById("door").setAttribute("src", `assets/media/house/door${Math.floor(Math.random() * PRACTICE_ONE_ANSWER_NUM)}.svg`);
    document.getElementById("roof").setAttribute("src", `assets/media/house/roof${Math.floor(Math.random() * PRACTICE_ONE_ANSWER_NUM)}.svg`);
    document.getElementById("reminder").addEventListener("click", () => {
        document.getElementById("reminder-text").classList.toggle("none");
        document.getElementById("reminder").innerText = (document.getElementById("reminder").innerText === "רוצים תזכורת?" ? "לסגור" : "רוצים תזכורת?");
    });
    // document.getElementById("house").addEventListener("click", changeColor);
    document.getElementById("door").addEventListener("click", changeDoorColor);
    document.getElementById("roof").addEventListener("click", changeRoofColor);
}

const changeHouseColor = () => {
    let currColor = Number(document.getElementById("house").getAttribute("src").slice(-5, -4));
    currColor++;
    if (currColor === PRACTICE_ONE_ANSWER_NUM) {
        currColor = 0;
    }
    document.getElementById("house").setAttribute("src", `assets/media/house/house${currColor}.svg`);
    isCorrect()
}

const changeRoofColor = () => {
    let currColor = Number(document.getElementById("roof").getAttribute("src").slice(-5, -4));
    currColor++;
    if (currColor === PRACTICE_ONE_ANSWER_NUM) {
        currColor = 0;
    }
    document.getElementById("roof").setAttribute("src", `assets/media/house/roof${currColor}.svg`);
    isCorrect()  
}

const changeDoorColor = (event) => {
    let currColor = Number(document.getElementById("door").getAttribute("src").slice(-5, -4));
    currColor++;
    if (currColor === PRACTICE_ONE_ANSWER_NUM) {
        currColor = 0;
    }
    document.getElementById("door").setAttribute("src", `assets/media/house/door${currColor}.svg`);
    isCorrect()
}

const isCorrect = () => {
    if (Number(document.getElementById("house").getAttribute("src").slice(-5, -4)) === PRACTICE_ONE_ANSWERS[0] &&
        Number(document.getElementById("door").getAttribute("src").slice(-5, -4)) === PRACTICE_ONE_ANSWERS[1] &&
        Number(document.getElementById("roof").getAttribute("src").slice(-5, -4)) === PRACTICE_ONE_ANSWERS[2]
    ) {
        document.getElementById("next").addEventListener("click", showMap);
        document.getElementById("next").style.backgroundColor = "rgb(76, 39, 25)";
    } else {
        document.getElementById("next").style.backgroundColor = "gray";
        document.getElementById("next").removeEventListener("click", showMap);
    }
}

// Second practice
var handlePractice2 = () => {
    userArr = [];
    succesLength = 0;
    showOrder(0);
}

const showOrder = (i) => {
    if (succesLength < 5) {
        setTimeout(() => {
            document.getElementById("error").style.display = "none";
            document.getElementById(`option-${i}`).classList.add("blink-animation");
            document.getElementById(`option-${i}`).addEventListener("animationend", (event) => {
                document.getElementById(`option-${i}`).classList.remove("blink-animation");
            });
            if (i < succesLength) {
                showOrder(i + 1);
            } else {
                setTimeout(() => {
                    for (let j = 0; j < PRACTICE_TWO_ANSWER_NUM; j++) {
                        document.getElementById(`option-${j}`).addEventListener("click", eggClick);
                    }
                }, 1000)
            }
        }, 1000);
    } else {
        document.getElementById("next").addEventListener("click", showMap);
        document.getElementById("next").style.backgroundColor = "rgb(76, 39, 25)";
    }
}

const eggClick = (event) => {
    event.currentTarget.classList.add("click-animation");
    event.currentTarget.addEventListener("animationend", (event) => {
        event.currentTarget.classList.remove("click-animation");
    })
    userArr.push(Number(event.currentTarget.id[7]))
    for (let counter = 0; counter < userArr.length; counter++) {
        if (userArr[counter] === counter) {
            if (counter === succesLength) {
                succesLength++;
                userArr = [];
                for (let j = 0; j < PRACTICE_TWO_ANSWER_NUM; j++) {
                    document.getElementById(`option-${j}`).removeEventListener("click", eggClick);
                }
                showOrder(0);
            }
        } else {
            userArr = [];
            succesLength = 0;
            document.getElementById("error").style.display = "block";
            setTimeout(() => {
                document.getElementById("error").style.display = "none";
            }, 2000)
            for (let i = 0; i < PRACTICE_TWO_ANSWER_NUM; i++) {
                document.getElementById(`option-${i}`).removeEventListener("click", eggClick);
            }
            showOrder(0);
        }
    }
}