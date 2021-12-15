var song
var img
var fft
var eq
var analyzer
var audiovolume
var particles = []
var bassSlider
var t = 0;

function preload() {
    song = loadSound('atall.mp3')
    img = loadImage('arkknightcity.png')
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER)
    rectMode(CENTER)
    analyzer = new p5.Amplitude();
    fft = new p5.FFT(0.5);
    eq = new p5.EQ(3);
    img.filter(BLUR, 8);
    eq.process(song);

    sliders();

    noLoop();

 

  }

function draw() { 

  background(0);

  audioChange();

  vizSetup(); 

  waveForm();

  particleStyle();

  bassForm();

  trebleForm();

}

function vizSetup(){
  angleMode(DEGREES)

  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if (amp > 200) {
    rotate(random(-0.5, 0.5))
  }

  image(img, 0, 0, width + 100, height + 100)
  pop()

  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)


  stroke(255)
  strokeWeight(2)
  noFill()
}

function waveForm(){

  angleMode(DEGREES)

  var wave = fft.waveform()

  for (var t = -1; t <= 1; t += 2) {
    push()
      beginShape()
      for (var i = 0; i <= 180; i += 0.5) {
          var index = floor(map(i, 0, 180, 0, wave.length - 1))

          var r = map(wave[index], -1, 1, 150, 350)
          var x = r * sin(i) * t
          var y = r * cos(i)
          vertex(x, y)
      }
      endShape()
      pop()
  }
}

function bassForm(){
  angleMode(RADIANS);

  let bassEnergy = fft.getEnergy("bass");
  for (var t = -1; t <= 1; t += 2){
  push();
  beginShape();
  for(i = 0; i <= 180; i++) {
    var r = bassEnergy*((bassSlider.value()+50)/50);
    var x = r*sin(i) * t;
    var y = r*cos(i);

    stroke(75, 0, 255);
    strokeWeight(1);
    noFill();
    line(0,0,x,y);
  }
  endShape();
  pop();
  }
}

function trebleForm(){
  angleMode(RADIANS);
  
  let trebleEnergy = fft.getEnergy("treble");
  for (var t = -1; t <= 1; t += 2){
    push();
    beginShape();
    for(i = 0; i < 50; i++) {
      var r = trebleEnergy*((trebleSlider.value()+50)/50);
      var x = r*cos(i);
      var y = r*sin(i) * t;
  
      stroke(255, 0, 50);
      strokeWeight(0.5);
      noFill();
      vertex(x,y);
    }
    endShape();
    pop();
    }
}

function particleStyle(){
  angleMode(DEGREES)
  var p = new Particle()
  particles.push(p)


  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 230)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }

  }
}

function sliders(){
  var nonDiv=createDiv();
  nonDiv.id('containers');

  let adjust = createP('Volume:');
  adjust.style("font-size: 1.5em");
  adjust.parent(nonDiv);
  slider = createSlider(0, 100, 50);
  slider.parent(nonDiv);

  let adjust2 = createP('Bass:');
  adjust2.style("font-size: 1.5em");
  adjust2.parent(nonDiv);
  bassSlider = createSlider(-50, 50, 0);
  bassSlider.parent(nonDiv);

  let adjust3 = createP('Treble:');
  adjust3.style("font-size: 1.5em");
  adjust3.parent(nonDiv);
  trebleSlider = createSlider(-50, 50, 0);
  trebleSlider.parent(nonDiv);
}

// let slider = document.getElementById("volumeslider");

function audioChange(){

  if(slider.value()){
    var audiovolume = slider.value()/100;
    if(audiovolume <= 0.1){
      audiovolume = 0;
    }
    song.setVolume(audiovolume);
  }

  if(bassSlider.value()){
    eq.bands[0].gain(bassSlider.value());
  }

  if(trebleSlider.value()){
    eq.bands[2].gain(trebleSlider.value());
  }
}
  
function keyPressed() {
  if (keyCode === 32){
    if (song.isPlaying()) {
        song.pause()
          noLoop()
    } else {
        song.play()
        loop()}
    }
}


class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0,0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3, 5)

    this.color = [random(0, 255), random(0, 255), random(0, 255),]
  }
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }
  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 || this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    } else {
      return false
    }
  }
  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
} 