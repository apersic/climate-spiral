let data;
const months = [
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
];

const zeroRadius = 125;
const oneRadius = 200;

let currentRow = 1;
let currentMonth = 1;

let perviousValue = 0;
let previousAngle = 0;

function drawGraph() {
  // Put 0, 0 coordinates in the middle
  translate(width / 2, height / 2);

  noFill();
  stroke(255);
  strokeWeight(4);
  circle(0, 0, zeroRadius * 2);
  fill(255);
  noStroke();
  text("0°", zeroRadius + 10, 0);

  noFill();
  stroke(255);
  strokeWeight(4);
  circle(0, 0, oneRadius * 2);
  fill(255);
  noStroke();
  text("1°", oneRadius + 10, -36);

  noFill();
  stroke(255);
  strokeWeight(4);
  circle(0, 0, 500);
}

function drawMonthLabels() {
  months.forEach((month, index) => {
    fill(255);
    noStroke();

    const angle = map(index, 0, months.length, 0, TWO_PI);
    push();
    const x = 250 * cos(angle);
    const y = 250 * sin(angle);
    translate(x, y);
    rotate(angle + PI / 2);
    text(month, 0, -10);
    pop();
  });
}

function drawData() {
  const year = data.getRow(currentRow).get("Year");

  textSize(32);
  text(year, 0, 0);

  noFill();
  stroke(255);
  let firstValue = true;
  for (let i = 0; i < currentRow; i++) {
    const row = data.getRow(i);
    let totalMonths = months.length;

    if (i === currentRow - 1) {
      totalMonths = currentMonth;
    }

    for (let j = 0; j < totalMonths; j++) {
      let value = row.get(months[j]);
      value = parseFloat(value);

      const angle = map(j, 0, months.length, 0, TWO_PI) - PI / 3;
      const prevR = map(perviousValue, 0, 1, zeroRadius, oneRadius);
      const r = map(value, 0, 1, zeroRadius, oneRadius);

      const x1 = r * cos(angle);
      const y1 = r * sin(angle);
      const x2 = prevR * cos(previousAngle);
      const y2 = prevR * sin(previousAngle);

      if (!firstValue) {
        const average = (value + perviousValue) / 2;
        const coldColor = color(86, 171, 236);
        const warmColor = color(242, 51, 59);
        const zeroColor = color(255);

        let lineColor = zeroColor;

        if (average < 0) {
          lineColor = lerpColor(zeroColor, coldColor, abs(average));
        }
        if (average > 0) {
          lineColor = lerpColor(zeroColor, warmColor, abs(average));
        }

        stroke(lineColor);
        line(x1, y1, x2, y2);
      }
      firstValue = false;

      perviousValue = value;
      previousAngle = angle;
    }
  }

  currentMonth++;
  if (currentMonth === months.length) {
    currentMonth = 0;
    currentRow++;

    if (currentRow === data.getRowCount()) {
      noLoop();
    }
  }
}

function preload() {
  data = loadTable("../data/giss_2022.csv", "csv", "header");
}

function setup() {
  createCanvas(document.body.clientWidth, document.body.clientHeight);
}

function draw() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(18);

  drawGraph();
  drawMonthLabels();

  frameRate(120);
  drawData();
}
