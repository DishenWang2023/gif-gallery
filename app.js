// Utility functions
// Given a processing object, a loop length, a radius, and an offset (optional)
function getLoopingNoise({
  p,
  loopLength,
  radius,
  offset = 0
}) {
  let t = p.millis()



  // This number should go from 0 to 1 every loopLength seconds
  // And PI*2 radians every loopLength seconds
  let noiseScale = 1
  let loopPct = (t * .001 / loopLength) % 1

  let theta = 2 * Math.PI * loopPct

  // Place to sample the noise from
  let x = radius * Math.cos(theta)
  let y = radius * Math.sin(theta)

  let noiseVal = p.noise(x * noiseScale, y * noiseScale, offset)
  return noiseVal
}


function getP5Element(index) {
  let element = document.getElementById("drawing" + index).getElementsByClassName("drawing-p5holder")[0]
  return element
}


//===========================================================

const WIDTH = 300
const HEIGHT = 300
const drawings = 4


// Run this function after the page is loaded
document.addEventListener("DOMContentLoaded", function() {
  console.log("Hello, animation!")

  // Rename your drawing here if you want
  let drawingTitles = ["TENET",
    "Particles",
    "DSOTM",
    "Neutron Star",
  ]
  let mainElement = document.getElementById("main")

  // Ignore this section if you want
  // This is me adding a label and a canvas-holder to each swatch
  // For each drawing
  for (var i = 0; i < drawings; i++) {
    let el = document.createElement("div")
    el.className = "drawing"
    el.id = "drawing" + i
    mainElement.append(el)


    // Add a label
    let label = document.createElement("div")
    label.className = "drawing-label"
    label.innerHTML = "Drawing #" + i + ":" + drawingTitles[i]
    el.append(label)

    // Add a div to hold the canvas (so we can resize it independently of the outer frame)
    let canvasHolder = document.createElement("div")
    canvasHolder.className = "drawing-p5holder"
    canvasHolder.style = `width:${WIDTH};height:${HEIGHT}`
    el.append(canvasHolder)
  }

  // Comment out these lines to not draw each
  setupDrawing0()
  setupDrawing1()
  setupDrawing2()
  setupDrawing3()
});


function setupDrawing0() {

  // Do things *once, before* P5 starts drawing
  function setup(p) {
    // Create the canvas in the right dimension
    p.createCanvas(WIDTH, HEIGHT);

    p.colorMode(p.HSL);

    // Set the background to black
    p.background(0);
  }

  // Draw (or do) things *each frame*
  function draw(p) {

    p.background(0);

    let word = 'N  E  T  E  N  E  T  E  N  E  T  E  N  E  T  E'

    let count = 7
    for (var i = 0; i < count; i++) {
      let iCount = count - 1

      let hAbs = Math.abs(iCount / 2 - i)
      let hpct = 1 - hAbs / iCount

      p.fill(50 + 50 * hpct)

      let yOffset = 0
      for (var j = 0; j < hAbs; j++) {
        yOffset += 65 * Math.pow(1 - j / iCount, 1.2)
      }
      let tSize = 65 * Math.pow(hpct, 2)
      p.textSize(tSize)
      let cWidth = p.textWidth(word + '  ')
      let totalYOffset = yOffset * Math.sign(iCount / 2 - i)
      let amt = cWidth
      let sign = (i % 2 == 0) ? -1 : 1
      let totalXOffset = sign * cWidth * p.map((p.frameCount * 15 / tSize) % amt, 0, amt, 0, 1)
      p.push()
      p.translate(WIDTH / 2, HEIGHT / 2)
      p.rotate(Math.PI / 4)
      p.textAlign(p.CENTER, p.CENTER)
      p.text(word, totalXOffset, totalYOffset)
      p.text(word, totalXOffset - sign * cWidth, totalYOffset)
      p.pop()
    }
  }

  // Setup a P5 instance with these draw and setup functions
  // Yes, this code is very weird.  You can ignore it
  let element = getP5Element(0) // My function to get the element for this index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing1() {
  let particles = [];
  let collidePct = [0, 0, 0, 0, 0];
  let lights = [{
      x: 30,
      y: 60,
      d: 10
    },
    {
      x: 80,
      y: 160,
      d: 10
    },
    {
      x: 280,
      y: 100,
      d: 10
    },
    {
      x: 170,
      y: 30,
      d: 10
    },
    {
      x: 200,
      y: 250,
      d: 10
    }
  ]

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL)
    p.background(0)
    let count = 20
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(p, WIDTH, HEIGHT, lights))
    }
  }

  function draw(p) {

    // Draw the background, but only transparently
    //  and only every 5 frames
    // This lets you leave trails by not fully erasing the previous frame
    p.background(0)
    let iCollide = -1
    // Now lets make this loop
    // Make a percent that goes from 0-1 every 6 seconds
    let t = p.millis() * .001
    let loopPct = (t / 6) % 1

    for (var i = 0; i < lights.length; i++) {
      p.strokeWeight(10)
      if (collidePct[i] > 0) {
        collidePct[i] -= 1
      }
      p.fill('rgba(255,124,' + (150 + collidePct[i]) + ',' + collidePct[i] / 50 + ')')
      p.stroke('rgba(255,150,' + (150 + collidePct[i]) + ',' + collidePct[i] / 100 + ')')
      p.circle(lights[i].x, lights[i].y, lights[i].d)
    }
    for (var i = 0; i < particles.length; i++) {
      particles[i].createParticle()
      collidePct[particles[i].moveParticle(lights)] = 50
    }

  }


  let element = getP5Element(1) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing2() {
  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {
    let w = WIDTH
    let h = HEIGHT
    let base = 60
    let top = {
      x: w / 2,
      y: h / 4
    }
    let middle = {
      x: top.x,
      y: top.y + 30
    }
    p.background(0)
    p.strokeWeight(2)
    p.stroke(100, 100, 100);
    p.line(0, h / 2, middle.x, middle.y)
    let count = 30
    for (var i = 0; i < count; i++) {
      p.stroke((100 - i * 10 + p.frameCount) % 360, 100, 60, 0.1)
      p.line(middle.x, middle.y, w, h / 2 - count / 2 + i)
    }
    p.strokeWeight(1)
    p.stroke(100, 100, 100)
    p.fill(0, 0, 0)
    p.triangle(top.x, top.y, top.x - base, top.y + base * Math.pow(3, 1 / 2), top.x + base, top.y + base * Math.pow(3, 1 / 2))
  }


  let element = getP5Element(2) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing3() {
  let topRight = []
  let topLeft = []
  let bottomRight = []
  let bottomLeft = []
  let count = 60
  let w = WIDTH
  let h = HEIGHT
  let d = 100
  let arcOffset = 20

  function setup(p) {
    p.createCanvas(w, h);
    p.colorMode(p.HSL);
    p.background(0);
    for (var i = 0; i < count; i++) {
      topRight.push(new Arc(p, w, (h - d) / 2 + arcOffset, w, 'topRight'))
      topLeft.push(new Arc(p, 0, (h - d) / 2 + arcOffset, w, 'topLeft'))
      bottomRight.push(new Arc(p, w, (h + d) / 2 - arcOffset, w, 'bottomRight'))
      bottomLeft.push(new Arc(p, 0, (h + d) / 2 - arcOffset, w, 'bottomLeft'))
    }
  }

  function draw(p) {
    if (p.frameCount % 5 === 0)
      p.background(0, 0, 0, .1)
    p.strokeWeight(1)
    p.noFill()
    for (var i = 0; i < count; i++) {
      let hArc = 230 + i * 25
      topRight[i].drawArc(hArc)
      topLeft[i].drawArc(hArc)
      bottomRight[i].drawArc(hArc)
      bottomLeft[i].drawArc(hArc)
    }
    p.stroke(100, 100, 100)
    p.fill(0, 0, 0)
    p.circle(w / 2, h / 2, d)
  }


  let element = getP5Element(3) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing4() {

  // Pick out a random hue,
  // and declare it up here in the outer scope
  // where both setup and draw have access to it

  let hue = Math.random() * 360

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {
    p.background(0, 0, 50)
    let t = p.millis() * .001

    p.push()
    p.translate(p.width / 2, p.height / 2)

    p.noiseDetail(5, 0.3);


    let count = 100
    for (var i = 0; i < count; i++) {
      let theta = i * .1 + t

      // I'm using "r" as a radius
      // it gets bigger with bigger i values
      // so it spirals outwards
      // But also I'm adding some noise
      // so it wiggles a bit
      let r = i + 90 * p.noise(i * .1 + t * 2, t)

      // Convert from polar coordinates to x,y
      let x = r * Math.cos(theta)
      let y = r * Math.sin(theta)

      p.line(0, 0, x, y)
      p.fill(0, 100, 100)
      p.circle(x, y, i * .1 + 1)

    }


    p.pop()
  }


  let element = getP5Element(4) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing5() {

  // This is a demonstbasen of a trick that I use to create looping noise
  // (you can use it with the function getLoopingNoise
  // without knowing how it works)

  // I use polar coordinates to sample *2D noise* in a circle
  // The bigger the circle, the more variance the noise has
  // Even though this uses noise *which doesnt repeat* it still
  // makes a perfect loop because it ends up in the same place it started

  // Variables that we want *everything* to have access to
  let noiseScale = .04
  let noiseOffset = 100

  // This is a

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);

    let tileCount = 60
    let tilesW = p.width / tileCount
    let tilesH = p.height / tileCount
    p.noiseDetail(5, 0.3);

    // Create a grid of squares to show a 2D noise function

    p.noStroke()
    for (var i = 0; i < tileCount; i++) {
      for (var j = 0; j < tileCount; j++) {
        let x = tilesW * i
        let y = tilesH * j
        let noiseVal = p.noise(x * noiseScale + noiseOffset, y * noiseScale + noiseOffset)

        p.fill(0, 0, noiseVal * 100)
        p.rect(x, y, tilesW, tilesH)

      }
    }
  }

  function draw(p) {
    let t = p.millis()

    // Go around the loop every 6 seconds
    let loopPct = (t / 6000) % 1
    let theta = loopPct * Math.PI * 2

    // Center the origin
    p.push()
    p.translate(p.width / 2, p.height / 2)

    for (var i = 0; i < 4; i++) {
      let r = 30 + 30 * i
      let x = r * Math.cos(theta)
      let y = r * Math.sin(theta)

      let noiseVal = p.noise(x * noiseScale + noiseOffset, y * noiseScale + noiseOffset)
      let radius = 40 * noiseVal
      p.fill(0, 0, 100 * noiseVal)

      p.stroke(0)
      p.circle(x, y, radius)
    }

    p.pop()
  }


  let element = getP5Element(5) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing6() {
  let loopLength = 6

  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {
    p.background(0, 0, 0)
    let t = p.millis() * .001


    p.push()
    p.translate(p.width / 2, p.height / 2)

    let shapes = 5

    for (var i = 0; i < shapes; i++) {

      // In P5, you can draw shapes with
      // beginShape, some vertex() and endShape()
      // If it doesn't appear, make sure you have begin and ended your shape!
      // You can use curves as well, but we won't cover those until next week
      p.beginShape()

      p.stroke(0, 100, 100)
      p.fill(j * 10, 100, 50, .4)

      let sides = 40

      for (var j = 0; j < sides; j++) {
        let theta0 = Math.PI * 2 * (j) / sides
        let r0 = (40 + 2 * i * i) * getLoopingNoise({
          p: p,
          loopLength: loopLength,
          radius: i,
          offset: j * .3 + i
        }) + i * 20

        p.vertex(r0 * Math.cos(theta0), r0 * Math.sin(theta0))


      }
      p.endShape(p.CLOSE)

    }

    p.pop()
  }


  let element = getP5Element(6) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


function setupDrawing7() {

  let hue = Math.random() * 360
  let loopLength = 6



  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {
    p.background(0, 0, 0)

    let t = p.millis() * .001

    p.push()
    p.translate(p.width / 2, p.height / 2)

    // Make a blue-purple gradient by stacking circles
    for (var i = 0; i < 6; i++) {
      p.fill(210 + i * 10, 100, 20, .1)
      let r = 1 + .2 * i
      p.ellipse(0, 0, r * 200, r * 140)
    }

    // Here's a function to draw a star that fades out as it ages
    function drawStar(index, agePct) {
      // Goes from 0 to 1 to 0, smoothly
      let fade = Math.sin(agePct * Math.PI)


      // Draw the center
      p.noStroke()

      // Flicker 10 times per lifespan
      let blink = .6 + .3 * Math.sin(agePct * Math.PI * 20)
      p.fill(0, 100, 100, fade * blink)
      p.circle(0, 0, 5)

      p.fill((index * 20) % 360, 100, 80, fade * blink * .1)
      p.circle(0, 0, 25 * blink)

      p.fill(0, 100, 100, fade * .8)
      p.beginShape()
      let starPts = 10

      for (var i = 0; i < starPts; i++) {
        let theta = Math.PI * 2 * i / starPts
        // Use noise to ascillate the length of the star's "arms"
        // for a twinkling effect
        let r = fade * 20 * (i % 2 + .2) * p.noise(i + index, 10 * agePct)
        p.vertex(r * Math.cos(theta), r * Math.sin(theta))
      }
      p.endShape()
    }

    let starCount = 90
    for (var i = 0; i < starCount; i++) {
      // Each star has an age, and cycles from 0 to 1
      // But with an offset, so they don't all do it at the same time
      let agePct = ((i * 2.9 + t) % loopLength) / loopLength

      // Arrange the stars in a spiral
      let r = 10 * Math.pow(i, .7)
      let theta = 1.2 * Math.pow(i, .7)

      let x = r * Math.cos(theta)
      let y = r * Math.sin(theta)

      p.push()
      p.translate(x, y)

      drawStar(i, agePct)
      p.pop()

    }
    p.pop()

  }


  let element = getP5Element(7) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}


// Drawing using SVG images
function setupDrawing8() {

  let loopLength = 6

  let svgs = [humanSVG, owlSVG, headSVG, dinoSVG, lotusSVG, heartHandsSVG, musclesSVG]

  // Use my included SVG library to load these commands and scale the SVG
  // This library lets me load the SVG, but also scale it to fit a certain size
  // Since SVGs can be any size, this keeps any possible SVG I load to a uniform size
  // ...so that I don't have to change the rest of the drawing code
  let svgImage = new SVGImage(svgs[4])
  svgImage.scaleToFit(WIDTH * .7, HEIGHT * .7, true)


  function setup(p) {
    p.createCanvas(WIDTH, HEIGHT);
    p.colorMode(p.HSL);
    p.background(0);
  }

  function draw(p) {

    let loopPct = (p.millis() * .001 / loopLength) % 1

    p.background(0, 0, 0, .05)

    p.push()
    p.translate(p.width / 2, p.height / 2);


    // Draw a bunch of circles, using various looping tricks

    for (var i = 0; i < 120; i++) {
      let hue = (loopPct * 360 + i * 10) % 360
      let pastel = Math.sin(loopPct * Math.PI * 2 + i * 2)

      p.stroke(hue, 100, 80, .8)
      p.fill(hue, 100, 50 + 50 * pastel, .7 - i * .003)
      let x = (p.noise(i) - .5) * p.width * 1.2
      let y = (p.noise(i + 100) - .5) * p.height * 1.2
      p.circle(x, y, 40 + 20 * Math.sin(loopPct * Math.PI * 2 + i))
    }

    p.stroke(0, 100, 100)
    p.fill(0)
    p.beginShape()
    let count = 10;
    for (var i = 0; i < count; i++) {
      let theta = Math.PI * 2 * i / count
      let r = p.width * 2
      p.vertex(r * Math.cos(theta), r * Math.sin(theta))
    }

    svgImage.draw(p, true)
    p.endShape()

    // Repeatedly draw the SVG shape, but fade it out
    let outlineCount = 10
    for (var i = 0; i < outlineCount; i++) {
      // Make a second percentage that decides how far out it is
      // This is a handy trick for
      // "things that get continually larger, but forever"

      let pct2 = (loopPct + i / outlineCount) % 1
      p.push()
      p.scale(1 + pct2 * 3, 1 + pct2)
      p.noFill()
      p.stroke(0, 100, 100, (1 - pct2) * .3)
      svgImage.draw(p)
      p.pop()
    }

    p.pop()

  }


  let element = getP5Element(8) // <- Make sure to change this to the right index
  let myP5 = new p5(function(p) {
    p.setup = () => setup(p)
    p.draw = () => draw(p)
  }, element);
}