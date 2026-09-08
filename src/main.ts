// Module 0 Milestone — a triangle rendered with ZERO libraries.
// This is the only time in the whole course you'll write WebGL this "raw" —
// starting Module 4 we build a small renderer class to wrap this pain away.

const canvas = document.querySelector<HTMLCanvasElement>('#app')!;
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error('WebGL2 not supported on this browser/GPU.');
}

// --- 1. Shader source -------------------------------------------------
// Vertex shader: runs once PER VERTEX. Its only required job is to set
// gl_Position — the clip-space position of that vertex.
const vertexShaderSource = `#version 300 es
  in vec2 a_position;

  void main() {
    // Clip space runs from -1 to 1 on both axes, center-origin.
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Fragment shader: runs once PER PIXEL covered by the triangle. Its job
// is to set the output color.
const fragmentShaderSource = `#version 300 es
  precision highp float;
  out vec4 outColor;

  void main() {
    outColor = vec4(0.2, 0.8, 0.4, 1.0); // a green, RGBA 0..1
  }
`;

// --- 2. Compile + link helper ------------------------------------------
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

// --- 3. Vertex data ------------------------------------------------------
// Three points, in clip space (-1..1), forming a triangle.
// prettier-ignore
const positions = new Float32Array([
   0.0,  0.6,
  -0.6, -0.6,
   0.6, -0.6,
]);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const positionAttribLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttribLocation);
// Tell the GPU: read 2 floats per vertex, not normalized, tightly packed.
gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

// --- 4. Draw ---------------------------------------------------------
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.1, 0.1, 0.15, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);
gl.bindVertexArray(vao);
gl.drawArrays(gl.TRIANGLES, 0, 3);

console.log('Module 0 complete: raw WebGL2 triangle rendered.');