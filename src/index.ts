import fragmentShaderSrc from "./shaders/perlin2d/fragment.glsl";
import vertexShaderSrc from "./shaders/perlin2d/vertex.glsl";
import resizeCanvas from "./ResizeCanvas";
import createProgram from "./CreateProgram";
import createBuffer from "./CreateBuffer";
import draw from "./Draw";

const canvas: HTMLCanvasElement = document.getElementById(
  "glCanvas"
)! as HTMLCanvasElement;
const gl: WebGLRenderingContext | null = canvas.getContext("webgl");

if (gl === null) throw new Error("webgl not supported");

const shaders: { src: string; type: GLenum }[] = [
  { src: fragmentShaderSrc, type: gl.FRAGMENT_SHADER },
  { src: vertexShaderSrc, type: gl.VERTEX_SHADER },
];

const program = createProgram(gl, shaders);

// Set window width and height
let canvasWidth = gl.getUniformLocation(program, "canvasWidth");
let canvasHeight = gl.getUniformLocation(program, "canvasHeight");

canvas.onresize = (e) => {
  gl.uniform1f(canvasWidth, <number>canvas.width);
  gl.uniform1f(canvasHeight, <number>canvas.height);
};

// Set Seed
let seed = gl.getUniformLocation(program, "seed");
document.getElementById("seed")!.onchange = (e) => {
  gl.uniform1f(
    seed,
    <number>parseFloat((<HTMLInputElement>e.target!).value) * 30000.0
  );
};

// Set frequency
let frequency = gl.getUniformLocation(program, "frequency");

document.getElementById("frequency")!.onchange = (e) => {
  gl.uniform1f(
    frequency,
    <number>parseFloat((<HTMLInputElement>e.target!).value)
  );
};

// Set res
let res = gl.getUniformLocation(program, "resolution");

document.getElementById("res")!.onchange = (e) => {
  gl.uniform1i(res, <number>parseInt((<HTMLInputElement>e.target!).value));
};

const geometryBuffer = createBuffer(gl);

// Set up attributes and uniforms
const attributes = {
  position: gl.getAttribLocation(program, "a_position"),
};

const uniforms = {
  resolution: gl.getUniformLocation(program, "u_resolution"),
  millis: gl.getUniformLocation(program, "u_millis"),
};

// Set WebGL program here (we have only one)
gl.useProgram(program);

// Resize canvas and viewport
const resize = () => {
  resizeCanvas(gl.canvas! as HTMLCanvasElement, null);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

// Setup canvas
// window.onresize = resize;
resize();

// Start rendering
requestAnimationFrame((now) => {
  draw(gl, now, {
    geometryBuffer,
    attributes,
    uniforms,
  });
});

// Managing User Canavas Resizes

(<HTMLInputElement>(
  document.getElementById("width")!
)).value = `${gl.canvas.width}`;
(<HTMLInputElement>(
  document.getElementById("height")!
)).value = `${gl.canvas.height}`;
document.getElementById("width")!.onchange = (e) => {
  canvas.width = ~~(<HTMLInputElement>e.target!).value;
  resize();
};
document.getElementById("height")!.onchange = (e) => {
  canvas.height = ~~(<HTMLInputElement>e.target!).value;
  resize();
};
document.getElementById("size")!.onclick = (e) => {
  resizeCanvas(gl.canvas! as HTMLCanvasElement, 2.0);
  (<HTMLInputElement>(
    document.getElementById("width")!
  )).value = `${gl.canvas.width}`;
  (<HTMLInputElement>(
    document.getElementById("height")!
  )).value = `${gl.canvas.height}`;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
};

// Setting Uniforms

gl.uniform1f(
  seed,
  <number>parseFloat((<HTMLInputElement>document.getElementById("seed")!).value)
);
gl.uniform1f(canvasWidth, <number>canvas.width);
gl.uniform1f(canvasHeight, <number>canvas.height);
gl.uniform1f(
  frequency,
  <number>(
    parseFloat((<HTMLInputElement>document.getElementById("frequency")!).value)
  )
);
gl.uniform1i(
  res,
  <number>parseInt((<HTMLInputElement>document.getElementById("res")!).value)
);
