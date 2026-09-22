 // src/math/Matrix3.test.ts
import { Matrix3 } from './Matrix3';
import { Easing, lerp } from './Easing';

function assertClose(actual: number, expected: number, msg: string) {
  const EPSILON = 1e-5;
  if (Math.abs(actual - expected) > EPSILON) {
    throw new Error(`FAILED: ${msg} — expected ${expected}, got ${actual}`);
  }
  console.log(`PASS: ${msg}`);
}
 
function runMatrix3Tests() {
  // A translation matrix should move a point by exactly (tx, ty).
  // We're not building a full Vector-transform helper yet (that's a
  // natural thing to add once you need it in Module 3/4) — this test
  // checks the matrix DATA directly, which is enough to prove correctness.
  const t = Matrix3.translation(10, 20);
  assertClose(t.data[6], 10, 'translation tx stored correctly');
  assertClose(t.data[7], 20, 'translation ty stored correctly');
 
  // Identity composed with anything should equal that thing, unchanged.
  const id = new Matrix3();
  const s = Matrix3.scale(3, 3);
  const composed = Matrix3.multiply(id, s);
  assertClose(composed.data[0], 3, 'identity * scale(3,3) preserves scale.x');
  assertClose(composed.data[4], 3, 'identity * scale(3,3) preserves scale.y');
 
  // Easing sanity checks: every easing fn must satisfy f(0)=0, f(1)=1
  // (easeOutBack overshoots BETWEEN 0 and 1, but still must hit the endpoints).
  for (const [name, fn] of Object.entries(Easing)) {
    assertClose(fn(0), 0, `${name}(0) === 0`);
    assertClose(fn(1), 1, `${name}(1) === 1`);
  }
 
  assertClose(lerp(0, 10, 0.5), 5, 'lerp midpoint');
}
 
runMatrix3Tests();
