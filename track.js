let cnv;
let points = [];
let circles = [];
let drawing = [];
let circlesVisible = false;
let t = 0;
let counter = 0;
let con = 20;
let dCon = 1;
let dir = [1,0];
let dTheta = Math.PI / 12;
let cT = Math.cos(dTheta);
let sT = Math.sin(dTheta);

function transformToPoints(x, y) {
    return {re: x - width / 2, img: -(y - height / 2)};
}

function resetPoints() {
    t = 0;
    circles = [];
    for (let k = 0; k < points.length; k++) {
        let real = 0;
        let imaginary = 0;
        for (let n = 0; n < points.length; n++) {
            let tPoint = transformToPoints(points[n].re, points[n].img);
            let phi = (TWO_PI * k * n) / points.length;
            real += tPoint.re * cos(phi) + tPoint.img * sin(phi);
            imaginary -= tPoint.img * cos(phi) - tPoint.re * sin(phi);
        }
        circles.push({
            amp: Math.sqrt(real ** 2 + imaginary ** 2) / (points.length),
            frequency: k,
            phase: atan2(imaginary, real)
        })
    }
}

function drawCircles() {
    background(0);
    translate(width / 2, height / 2);
    stroke(255, 100);
    noFill();
    let prevx = 0;
    let prevy = 0;
    for (let circle of circles) {
        let radius = circle.amp;
        ellipse(prevx, prevy, radius * 2);
        let x = radius * cos(circle.frequency * t + circle.phase);
        let y = radius * sin(circle.frequency * t + circle.phase);
        noFill();
        line(prevx, prevy, prevx + x, prevy + y);
        ellipse(prevx + x, prevy + y, 8);
        prevx += x;
        prevy += y;
    }
    drawing.unshift({prevx, prevy});

    stroke(255);
    beginShape();
    for (let element of drawing) {
        vertex(element.prevx, element.prevy);
    }
    endShape();

    if (drawing.length > points.length) {
        drawing.pop();
    }

    let dt = 1 * TWO_PI / points.length;
    t += dt;
    counter++;
}

function drawPolygon() {
    noFill();
    stroke(0);
    beginShape();
    for (let point of points) {
        vertex(point.re, point.img);
    }
    endShape();
    if (points.length !== 0) {
        let prevPoint = points[points.length - 1];
        stroke(255, 0, 0);
        line(prevPoint.re, prevPoint.img, prevPoint.re + con * dir[0], prevPoint.img + con * dir[1])
    }
}

function setup() {
    cnv = createCanvas(960, 720);
}

function keyPressed() {
    if (keyCode === 72) {
        //h
        dir = [1,0];
    }
    else if (keyCode === 86) {
        //v
        dir = [0,-1];
    }
    else if (keyCode === 70) {
        //f
        dir[0] *= -1;
        dir[1] *= -1;
    }
    else if (keyCode === 37) {
        //left arrow
        let x = dir[0];
        let y = dir[1];
        dir[0] = x * cT + y * sT;
        dir[1] = - x * sT + y * cT;
    }
    else if (keyCode === 39) {
        //right arrow
        let x = dir[0];
        let y = dir[1];
        dir[0] = x * cT - y * sT;
        dir[1] = x * sT + y * cT;
    }
    else if (keyCode === 38) {
        //up arrow
        con += dCon;
    }
    else if (keyCode === 40) {
        //down arrow
        if (con - dCon <= 0)
            con = 0;
        else
            con -= dCon;
    }
    else if (keyCode === 78) {
        //n
        dCon *= 0.5;
        dTheta *= 0.5;
        cT = Math.cos(dTheta);
        sT = Math.sin(dTheta);
    }
    else if (keyCode === 77) {
        //m
        dCon *= 2;
        dTheta *= 2;
        cT = Math.cos(dTheta);
        sT = Math.sin(dTheta);
    }
    else if (keyCode === 32) {
        //[space]
        if (points.length === 0) {
            points.push({re: mouseX, img: mouseY});
        }
        else {
            let prevPoint = points[points.length - 1];
            points.push({re: prevPoint.re + con * dir[0], img: prevPoint.img + con * dir[1]})
        }
    }
    else if (keyCode === 8) {
        //[Backspace]
        points.pop();
    }
    else if (keyCode === 80) {
        //p
        let string = "";
        for (let point of points) {
            string += "{re: " + point.re + ", img: " + point.img + "}, "
        }
        string = string.slice(0, -2);
        console.log(string);
    }
    else if (keyCode === 67) {
        //c
        circlesVisible = !circlesVisible;
        if (circlesVisible) {
            resetPoints();
        }
    }
    else if (keyCode === 83) {
        //s
        dCon = 1;
        dTheta = Math.PI / 12;
        cT = Math.cos(dTheta);
        sT = Math.sin(dTheta);
    }
    return false;
}

function draw() {
    background(255);
    drawPolygon();
    if (circlesVisible) {
        drawCircles();
    }
}
