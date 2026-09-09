// src/math/Vector3.ts
export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    addInPlace(other: Vector3): this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }

    subInPlace(other: Vector3): this {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        return this;
    }

    scaleInPlace(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
    }

    plus(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    minus(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    // Cross product only really makes sense in 3D — you'll use this in
    // Module 8 for computing surface normals for cell-shading lighting.
    cross(other: Vector3): Vector3 {
        return new Vector3(
            this.y * other.z - this.z * other.y,
            this.z * other.x - this.x * other.z,
            this.x * other.y - this.y * other.x
        );
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length(): number {
        return Math.sqrt(this.lengthSquared());
    }

    normalizeInPlace(): this {
        const len = this.length();
        if (len === 0) return this;
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }

    static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }
}