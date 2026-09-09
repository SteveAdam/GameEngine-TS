// src/math/Vector2.test.ts
// Minimal hand-rolled assertions — swap for Vitest if you want a real
// test runner (`npm install -D vitest`, add a "test" script). Either
// way, the habit of testing your math layer pays off constantly later,
// since a bug in Vector2.normalize silently breaks physics, not with
// an error message but with "movement feels wrong" three modules later.
import { Vector2 } from './Vector2';
function assertClose(actual: number, expected: number, msg: string) {
  const EPSILON = 1e-6;
  if (Math.abs(actual - expected) > EPSILON) {
    throw new Error(`FAILED: ${msg} — expected ${expected}, got ${actual}`);
  }
  console.log(`PASS: ${msg}`);
}

function runVector2Tests() {
  const a = new Vector2(3, 4);
  const b = new Vector2(1, 2);

  assertClose(a.length(), 5, 'length of (3,4) is 5');

  const sum = a.plus(b);
  assertClose(sum.x, 4, 'plus.x');
  assertClose(sum.y, 6, 'plus.y');

  const diff = a.minus(b);
  assertClose(diff.x, 2, 'minus.x');
  assertClose(diff.y, 2, 'minus.y');

  assertClose(a.dot(b), 11, 'dot product (3*1 + 4*2 = 11)');

  const normalized = a.clone().normalizeInPlace();
  assertClose(normalized.length(), 1, 'normalized vector has length 1');

  // Prove in-place vs pure semantics actually differ:
  const original = new Vector2(2, 2);
  const cloneForPure = original.clone();
  const pureResult = cloneForPure.plus(new Vector2(1, 1));
  assertClose(cloneForPure.x, 2, 'pure .plus() does NOT mutate the original');
  assertClose(pureResult.x, 3, 'pure .plus() returns a new vector');

  original.addInPlace(new Vector2(1, 1));
  assertClose(original.x, 3, 'in-place .addInPlace() DOES mutate the original');
}

runVector2Tests();