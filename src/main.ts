// Module 2 milestone — animating the triangle with a transform matrix + easing.
// This replaces the static Module 0 main.ts. Diffs from Module 0 are commented.

import { Matrix3 } from './math/Matrix3';
import { Easing, lerp } from './math/Easing';

const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
canvas.width = 800;
canvas.height = 600;

const context = canvas.getContext('webgl2');
if (!context) throw new Error('WebGL2 not supported.');
const gl: WebGL2RenderingContext = context;

// CHANGED: vertex shader now takes a u_transform uniform (our Matrix3) and
// applies it to each vertex position before clip space.
const vertexShaderSource = `#version 300 es
  in vec2 a_position;
  uniform mat3 u_transform;
 
  void main() {
    vec3 transformed = u_transform * vec3(a_position, 1.0);
    gl_Position = vec4(transformed.xy, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `#version 300 es
  precision highp float;
  out vec4 outColor;
  void main() {
    outColor = vec4(0.2, 0.8, 0.4, 1.0);
  }
`;

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed: ${info}`);
  }
  return shader;
}

const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = gl.createProgram()!;
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`);
}

// prettier-ignore
const positions = new Float32Array([
  0.0, 0.15,
  -0.15, -0.15,
  0.15, -0.15,
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

// NEW: grab the uniform location once, outside the loop.
const transformUniformLocation = gl.getUniformLocation(program, 'u_transform');

gl.viewport(0, 0, canvas.width, canvas.height);
gl.useProgram(program);
gl.bindVertexArray(vao);

// NEW: animate position along an eased path, ping-ponging left to right,
// using ONLY the Matrix3/Easing code you wrote — no libraries.
const startX = -0.7;
const endX = 0.7;
const durationMs = 1500;
let startTime = performance.now();
let reverse = false;

function render(now: number) {
  const elapsed = now - startTime;
  let t = Math.min(elapsed / durationMs, 1);
  const easedT = Easing.easeInOutQuad(t);

  const x = reverse ? lerp(endX, startX, easedT) : lerp(startX, endX, easedT);
  const transform = Matrix3.translation(x, 0);

  gl.clearColor(0.1, 0.1, 0.15, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniformMatrix3fv(transformUniformLocation, false, transform.data);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  if (t >= 1) {
    reverse = !reverse;
    startTime = now;
  }

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
console.log('Module 2 milestone: triangle easing back and forth via Matrix3 + Easing.');
