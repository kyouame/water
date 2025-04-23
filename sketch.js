let cols, rows;
let cellSize = 16;
let zOffsets = [];
let ripples = [];
let blues = [];
let letters = [];
let poem = "";
let dripSound;

function preload() {
  dripSound = loadSound('drip-tiny-water.mp3'); // 音效放置位置要正確
}

function setup() {
  createCanvas(450, 675);
  textSize(cellSize * 0.8);
  textAlign(CENTER, CENTER);
  cols = floor(width / cellSize);
  rows = floor(height / cellSize);

  poem = `睡眠，藍色的一汪水，淹過了一些字。它們才在滾沸、冒泡  讓我確信我是唯一一人，會有想替夢境上色的衝動。這混亂，我與重生的迫切分享，藍色的睡眠，從肌膚流出來，當你碰我時，我驚訝地感覺它是如此容易消失。醒不是一塊熟鐵，在我們之間熔化，需要時間；醒是一道薄膜，有著世界七彩的反射，像孩子玩弄的泡泡。你擠進我身邊，那薄膜的旁邊，醒的張力更大了。當我明白，我必須刺破它才能擁有你，我喃喃說道：還得再過一會，夢裡的人拿著骨頭唱歌，我還沒理解那是什麼樣的聲音。`;

  let poemChars = Array.from(poem);
  let totalCells = cols * rows;

  for (let i = 0; i < totalCells; i++) {
    letters[i] = poemChars[i % poemChars.length];
    zOffsets[i] = random(1000);
  }

  blues = [
    color("#81D4FA"),
    color("#4FC3F7"),
    color("#29B6F6")
  ];
}

function draw() {
  background(255);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let xpos = x * cellSize + cellSize / 2;
      let ypos = y * cellSize + cellSize / 2;

      let interference = 0;
      for (let r of ripples) {
        let dx = xpos - r.x;
        let dy = ypos - r.y;
        let d = sqrt(dx * dx + dy * dy);
        let wave = sin((d - r.radius) * 0.25);
        let attenuation = exp(-0.01 * (d - r.radius) ** 2);
        interference += wave * attenuation * 10;
      }

      let floatOffset = sin(zOffsets[index] + millis() * 0.002) * 1.5;
      let totalOffset = interference + floatOffset;

      let colorIndex = (sin(millis() * 0.001 + index) + 1) / 2;
      let c1 = lerpColor(blues[0], blues[1], colorIndex);
      let c2 = lerpColor(blues[1], blues[2], colorIndex);
      let finalColor = lerpColor(c1, c2, colorIndex);

      fill(finalColor);
      noStroke();
      text(letters[index], xpos, ypos + totalOffset);
    }
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].radius += 2.5;
    if (ripples[i].radius > width * 1.5) {
      ripples.splice(i, 1);
    }
  }
}

function mousePressed() {
  ripples.push({ x: mouseX, y: mouseY, radius: 0 });

  if (dripSound && dripSound.isLoaded()) {
    dripSound.play();
  }
}
