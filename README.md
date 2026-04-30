# Spinning Cube

A spinning 3D cube rendered with ASCII characters in JavaScript — built as a learning project to explore both programming and the linear algebra behind 3D graphics.

---

## How It Works (High Level)

1. Define the 6 faces of a cube, each with a starting corner, two direction vectors, and a normal vector
2. Each frame, rotate every face's normal vector using the combined rotation matrix `R = Rz · Ry · Rx`
3. Compute `luminance = normal · light_direction` (dot product) to determine brightness
4. Map luminance to an ASCII character from the set `.,-~:;=!*#$@`
5. Sample points across each face's surface and project them to 2D screen coordinates
6. Use Z-buffering to decide which face wins at each screen position when faces overlap
7. Loop with `requestAnimationFrame` to animate the cube

---

## The Math: Deriving the Rotation Matrix

### Step 1 — Points on a Circle

Any point at distance **r** from the origin, sitting at angle **θ**, can be written as:

```
x = r·cos(θ)
y = r·sin(θ)
```

### Step 2 — Rotating by an Angle

To rotate that point by an additional angle **α**, the distance r stays the same but the angle becomes **θ + α**:

```
x' = r·cos(θ + α)
y' = r·sin(θ + α)
```

### Step 3 — Expanding with Angle Addition Formulas

Using the angle addition identities:

```
cos(θ + α) = cos(θ)·cos(α) − sin(θ)·sin(α)
sin(θ + α) = sin(θ)·cos(α) + cos(θ)·sin(α)
```

Substituting in:

```
x' = r·cos(θ)·cos(α) − r·sin(θ)·sin(α)
y' = r·sin(θ)·cos(α) + r·cos(θ)·sin(α)
```

### Step 4 — Substituting Back

Since `r·cos(θ) = x` and `r·sin(θ) = y`:

```
x' = x·cos(α) − y·sin(α)
y' = x·sin(α) + y·cos(α)
```

### Step 5 — Matrix Form

These two equations are a linear combination of x and y, which means they can be expressed as a matrix multiplication:

```
| x' |   | cos(α)  -sin(α) |   | x |
| y' | = | sin(α)   cos(α) |   | y |
```

This is the **2D rotation matrix** — derived from first principles.

---

## Extending to 3D

In 3D, rotation happens around an **axis**. The key insight: whichever axis you rotate around, that coordinate stays fixed — and the other two rotate exactly like the 2D case.

### Rotation Around the Z-Axis (X and Y change, Z fixed)

```
| x' |   | cos(α)  -sin(α)   0 |   | x |
| y' | = | sin(α)   cos(α)   0 | · | y |
| z' |   |   0        0      1 |   | z |
```

### Rotation Around the X-Axis (Y and Z change, X fixed)

```
| x' |   | 1      0         0    |   | x |
| y' | = | 0   cos(α)   -sin(α)  | · | y |
| z' |   | 0   sin(α)    cos(α)  |   | z |
```

### Rotation Around the Y-Axis (X and Z change, Y fixed)

```
| x' |   | cos(α)   0   sin(α) |   | x |
| y' | = |   0      1     0    | · | y |
| z' |   | -sin(α)  0   cos(α) |   | z |
```

> Note: The Y-axis matrix has its sin terms flipped compared to Rx and Rz. This is a consequence of the right-hand rule — the Y-axis handedness is opposite to X and Z.

---

## Projection (3D → 2D Screen)

To draw a 3D point on a flat screen, we use perspective projection:

```
x' = x · (z' / z)
y' = y · (z' / z)
```

Where:
- `z'` = distance from the camera to the screen
- `z`  = distance from the camera to the point

---

## Surface Rendering

Each face of the cube is rendered by sampling points across its surface using two perpendicular direction vectors (tangent vectors). For each sampled point:

```
point = corner + u * direction1 + v * direction2
```

Where `u` and `v` step across the face in small increments.

All points on the same flat face share the same normal vector, so the entire face gets **one ASCII character** determined by:

```
luminance = dot(normal, light_direction)
character = ".,-~:;=!*#$@"[luminance_index]
```

The character can change each frame as the cube rotates and the normal's angle to the light changes.

---

## Z-Buffering

When multiple surfaces overlap on screen, Z-buffering decides which one to draw by keeping track of the depth (z-value) at each pixel position — the closest surface wins.