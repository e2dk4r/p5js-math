function v2(x, y) {
  return {x: x, y: y}
}

function v2_length_squared(v) {
  return v.x * v.x + v.y * v.y;
}

function v2_length(v) {
  return Math.sqrt(v2_length_squared(v));
}

function v2_add(a, b) {
  return v2(a.x + b.x, a.y + b.y);
}

function v2_sub(a, b) {
  return v2(a.x - b.x, a.y - b.y);
}

function v2_scale(a, scaler) {
  return v2(a.x * scaler, a.y * scaler);
}

function v2_dot(left, right) {
  return left.x * right.x + left.y + right.y;
}

function v2_perp(a) {
  return v2(-a.y, a.x);
}

function v2_normal(a) {
  return v2_scale(a, 1.0 / v2_length(a));
}

function v2_rotate(a, angle) {
  cosine = cos(angle);
  sine = sin(angle);
  return v2(
    a.x * cosine - a.y * sine,
    a.x * sine + a.y * cosine,
  );
}

const V2_ZERO = v2(0.0, 0.0);
const V2_LEFT = v2(-1.0, 0.0);
const V2_RIGHT = v2(1.0, 0.0);
const V2_UP = v2(0.0, 1.0);
const V2_DOWN = v2(0.0, -1.0);

const PIXELS_PER_METER = 30;
const METERS_PER_PIXEL = 1.0 / PIXELS_PER_METER;

/* in m/s */
const speed = 3;
/* in m/s */
let velocity = v2(-0.2, -0.3);
/* in m */
let position = v2(0.0, 1.0);
let angle = 0.0;

/* set in setup() */
let SCREEN_SIZE = v2(0.0, 0.0);
let SCREEN_CENTER = v2(0.0, 0.0);
let SCREEN_CENTER_IN_METERS = v2(0.0, 0.0);

function setup() {
  createCanvas(windowWidth, windowHeight);
  SCREEN_SIZE = v2(windowWidth, windowHeight);
  SCREEN_CENTER = v2_scale(SCREEN_SIZE, 0.5);
  SCREEN_CENTER_IN_METERS = v2_scale(SCREEN_CENTER, PIXELS_PER_METER);

  console.log({"output": { "mode": SCREEN_SIZE.x + "x" + SCREEN_SIZE.y} });
}

function ToScreenSpace(point) {
  const xAxis = v2(1, 0);
  const yAxis = v2_perp(xAxis);
  const origin = SCREEN_CENTER;
  
  const pointInScreenCoordinate = 
    v2(
      v2_dot(v2(point.x, 0), xAxis),
      v2_dot(v2(0, -point.y), yAxis) /* y goes down in screen */
    );
  return v2_add(origin, v2_scale(pointInScreenCoordinate, PIXELS_PER_METER));
}

/* p5 Utility */
function DrawLine(point1, point2, color, width) {  
  stroke(color);
  strokeWeight(width);
  
  const point1InScreenSpace = ToScreenSpace(point1);
  const point2InScreenSpace = ToScreenSpace(point2);
  line(point1InScreenSpace.x, point1InScreenSpace.y, point2InScreenSpace.x, point2InScreenSpace.y);
}

function DrawCircle(position, color, radius) {
  const positionInScreenSpace = ToScreenSpace(position);
  const radiusInPixels = radius * PIXELS_PER_METER;
  
  fill(0, 0, 0, 0);
  stroke(color);
  circle(positionInScreenSpace.x, positionInScreenSpace.y, radiusInPixels);
}

function DrawText(str, position, color) {
  const pixelInScreenSpace = ToScreenSpace(position);

  stroke(color);
  text(str, pixelInScreenSpace.x, pixelInScreenSpace.y);
}

function draw() {
  // delta time in seconds
  const dt = deltaTime * 0.001;
  
  background("black");
  // draw coordinate system
  DrawLine(v2(-SCREEN_CENTER_IN_METERS.x, 0), v2(SCREEN_CENTER_IN_METERS.x, 0), "blue", 1);
  DrawLine(v2(0, SCREEN_CENTER_IN_METERS.y), v2(0, -SCREEN_CENTER_IN_METERS.y), "red", 1);
  DrawCircle(v2(0, 0), "orange", 10);
  
  //  /* physics */
  //  // a(t) = a
  //  // v(t) = at + v₀
  //  // if (v2_length_squared(velocity) > 0) {
  //  //   velocity = v2_sub(velocity, v2_scale(velocity, 2.5 * dt));
  //  // }
  //  // p(t) = ½at² + vt + p₀
  //  position = v2_add(position, v2_scale(velocity, speed * dt));
  //  //console.log(position);

  //  DrawCircle(position, "lime", 0.25);
  //  DrawLine(position, v2_add(position, v2_normal(velocity)), "white", 0.5);
  //
  //  DrawText("player", v2_add( position, v2(-0.5, 0.5)), "lime");
  //  if (v2_length_squared(position) > 10 * 10) {
  //    position = v2(0, 0);
  //    velocity = v2(0.1, 0.3);
  //  }

  /* Rotating a vector */
  const a = v2(3, 0);
  DrawLine(V2_ZERO, a, "white", 2.0);

  const b = v2_rotate(a, angle);
  DrawLine(V2_ZERO, b, "aqua", 2.0);
  const rotationSpeed = 2.0;
  angle += rotationSpeed * dt;
}
