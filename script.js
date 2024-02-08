function animateZombie(el, speed, top){
    var offset = 200; 
    var cur_bgpos = 0;
    var cur_pos = 0;
    var interval;

    switch(speed){
        case 1:
            interval=40;
            break;
        case 2:
            interval=27;
            break;
        case 3:
            interval=33;
            break;
        case 4:
            interval=23;
            break;
        case 5:
            interval=17;
            break;
        default:
            interval=23;
            break;
    }

    zombieRunTime[el.id] = setInterval ( () => {
        if(top > 45) {
            el.style.backgroundPosition = cur_bgpos + offset +"px 0px";
        }
        else {
            el.style.backgroundPosition = -1600 +"px 0px";
        }
        el.style.left = 101 - cur_pos + "vw";
        if(top > 45) {
            cur_bgpos -= offset 
        }
        else {
            if (cur_pos % 16 < 8) {
                el.style.top = top + 0.3 + "vh";
            } else {
                el.style.top = top - 0.3 + "vh";
            }
            if (cur_pos % 12 < 4) {
                el.style.backgroundPosition = -1600 +"px 0px";
            } else if (cur_pos % 12 < 8) {
                el.style.backgroundPosition = -1400 +"px 0px";
            } else {
                el.style.backgroundPosition = -600 +"px 0px";
            }
        }
        cur_pos++;
        if (cur_bgpos == -1800)
            cur_bgpos = 0;
        if(cur_pos == 120){
            el.remove();
            health -= 1;
            updateHealth();
            if(health <= 0)
                gameEnd();
            clearInterval(zombieRunTime[el.id]);
        }
    }, interval);
}


function spawnZombie(speed, top, size, start_pos) {
    var elZombie = document.createElement("div");
    elZombie.classList.add("zombie");
    elZombie.setAttribute("id", idx);
    elZombie.addEventListener("click", zombieShot);
    elZombie.style.top = 45 + top + "vh";
    var vertical_position = 45 + top;
    elZombie.style.left = 100 + start_pos + "vw";
    elZombie.style.transform = "scale(" + size + ")";
    if (top < 0) {
        top *= (-(1/7));
    }
    elZombie.style.zIndex = top;
    board.appendChild(elZombie);
    idx++;
    animateZombie(elZombie, speed, vertical_position);
}


function generateZombie() {
    var speed = Math.round(Math.random()*5);
    var top = Math.round(Math.random()*3)+2;
    var fly = Math.random();
    var size = Math.sqrt(top)/2;
    if (fly > 0.75) {
        top *= (-7);
        var resize = Math.random();
        if (resize > 0.65) {
            size *= resize;
        }
    }
    var start_pos = Math.round(Math.random()*20);
    spawnZombie(speed, top, size, start_pos);
}


function updateHealth() {
    var x = document.getElementsByClassName("full");
    var y = document.getElementsByClassName("empty");
    if (health == 3) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.add("active");
            y[i].classList.remove("active");
        }
    }
    if (health == 2) {
        for (var i = 0; i < 3; i++) {
            if (i == 2) x[i].classList.remove("active");
            if (i == 0) y[i].classList.add("active");
        }
    }
    if (health == 1) {
        for (var i = 0; i < x.length; i++) {
            if (i >= 1) x[i].classList.remove("active");
            if (i <= 1) y[i].classList.add("active");
        }
    }
    if (health == 0) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("active");
            y[i].classList.add("active");
        }
        gameEnd();
    }
}


function hideHealth() {
    var x = document.getElementsByClassName("full");
    var y = document.getElementsByClassName("empty");
    for (var i = 0; i < 3; i++) {
        x[i].classList.remove("active");
        y[i].classList.remove("active");
    }
}


function updateScore() {
    elScore.textContent = "Score: " + score;
    if (score < 0) {
        health = 0;
        updateHealth();
    }
}


function hideScore() {
    elScore.textContent = "";
}


function boardShot() {
    score -= 3;
    updateScore();
}


function zombieShot() {
    score += 13;
    updateScore();
    clearInterval(zombieRunTime[this.id]);
    this.remove();
}


function startgameHandler() {
    elMenu.style.transform = "translate(-200%)";
    gameStart();
}


function startGame() {
    var zombies = document.querySelectorAll("div.zombie");
    for (var i = 0; i < zombies.length; i++) {
        zombies[i].remove();
        clearInterval(zombieRunTime[zombies[i].id]);
    }

    elEnd.style.transform = "translateY(-200%)";
    elMenu.style.transform = "translateY(0%)";
    document.getElementById("startbutton").addEventListener("click", startgameHandler);
}


function gameStart() {
    health = 3;
    score = 30;
    idx = 0;
    updateHealth();
    updateScore();
    board.addEventListener("click", boardShot);
    var zombies = document.querySelectorAll("div.zombie");
    for (var i = 0; i < zombies.length; i++) {
        zombies[i].remove();
    }
    gameRunning = setInterval(() => {
        generateZombie();
    }, 450);
}


function gameEnd() {
    clearInterval(gameRunning);
    
    var zombies = document.querySelectorAll("div.zombie");
    for (var i = 0; i < zombies.length; i++) {
         zombies[i].removeEventListener("click", zombieShot);
    }

    board.removeEventListener("click", boardShot);
    elEnd.style.transform = "translateY(0%)";

    endScore();
    document.getElementById("play_again_button").addEventListener("click", startGame);

    hideHealth();
    hideScore();
}


function endScore() {
    if (score < 0) score = 0;
    updateScore();
    document.getElementById("end-score").textContent = "Your score: " + score;
}


var board = document.querySelector("#board");
var elScore = document.querySelector("#score");
var elHealth = document.querySelector("#health");
var elMenu = document.querySelector("#start-container");
var elEnd = document.querySelector("#end-container");
var zombieRunTime = {};
var gameRunning;
var idx = 0;
var health = 3;
var score = 30;


startGame();