// src/math/Vector2.ts
// A small, engine-style value type. Deliberately NOT using classes-with-deep-
// inheritance — this is a leaf data type with operations, nothing more.

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  // --- Mutating (in-place) methods: use these inside hot loops (update()) ---
  // They are avoid allocating a new object every call, which matters once you
  // have hundreds of entities updating every frame.

  addInPlace(other: Vector2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  subInPlace(other: Vector2): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  scaleInPlace(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  normalizeInPlace(): this {
    const len = this.length();
    if (len === 0) return this;
    this.x /= len;
    this.y /= len;
    return this;
  }

  // --- Pure methods: safe/readable, but allocate. Fine for setup code,
  // one-off calculations, or anywhere not running every frame per entity. ---

  plus(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  scaled(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  // --- Non-mutating scalar results ---

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  lengthSquared(): number {
    // Prefer this over length() when just comparing distances —
    // avoids a sqrt call, which is relatively expensive.
    return this.x * this.x + this.y * this.y;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }
}



