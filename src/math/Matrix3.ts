// src/math/Matrix3.ts
// A 3x3 matrix representing a 2D affine transform (translate/rotate/scale).
// Stored as a flat Float32Array in COLUMN-MAJOR order, because that's what
// WebGL expects when you eventually upload a matrix to a shader uniform —
// building the habit now saves confusion in Module 4.
//
// Layout (column-major), for a matrix representing:
//   [ a  c  tx ]
//   [ b  d  ty ]
//   [ 0  0  1  ]
// the Float32Array is: [a, b, 0, c, d, 0, tx, ty, 1]
 
export class Matrix3 {
  data: Float32Array;
 
  constructor() {
    this.data = new Float32Array(9);
    this.identity();
  }
 
  identity(): this {
    // prettier-ignore
    this.data.set([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
    return this;
  }
 
  static translation(tx: number, ty: number): Matrix3 {
    const m = new Matrix3();
    // prettier-ignore
    m.data.set([
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ]);
    return m;
  }
 
  static rotation(radians: number): Matrix3 {
    const m = new Matrix3();
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    // prettier-ignore
    m.data.set([
      c, s, 0,
      -s, c, 0,
      0, 0, 1,
    ]);
    return m;
  }
 
  static scale(sx: number, sy: number): Matrix3 {
    const m = new Matrix3();
    // prettier-ignore
    m.data.set([
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ]);
    return m;
  }
 
  // The orthographic projection: maps a world-space rectangle
  // [0, width] x [0, height] (screen-space convention: Y down) into
  // clip space (-1..1, Y up). This is the matrix that finally lets you
  // stop hand-placing triangles in -1..1 and start working in pixels.
  static orthographic(width: number, height: number): Matrix3 {
    const m = new Matrix3();
    // prettier-ignore
    m.data.set([
      2 / width, 0, 0,
      0, -2 / height, 0,     // negative: flips Y so "down" in world space matches screen convention
      -1, 1, 1,
    ]);
    return m;
  }
 
  // Matrix multiplication: this = a * b (applies b's transform, then a's).
  // Order matters — this is a very common source of bugs, and one you WILL
  // hit at least once (things rotate around the wrong point, etc).
  static multiply(a: Matrix3, b: Matrix3): Matrix3 {
    const out = new Matrix3();
    const ad = a.data, bd = b.data, od = out.data;
 
    for (let col = 0; col < 3; col++) {
      for (let row = 0; row < 3; row++) {
        let sum = 0;
        for (let k = 0; k < 3; k++) {
          sum += ad[k * 3 + row] * bd[col * 3 + k];
        }
        od[col * 3 + row] = sum;
      }
    }
    return out;
  }
}
