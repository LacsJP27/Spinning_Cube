# Spinning Cube

A spinning 3D cube rendered with ASCII characters in JavaScript — built as a learning project to explore both programming and the linear algebra behind 3D graphics.


https://lacsjp27.github.io/Spinning_Cube/

---

## The Why

I am reaching the end of my third year as a Computer Science student and I am struggling with the balance of using LLMs. There are two ends of LLM usage as a student. On one end of the spectrum is the vibe-coding goblin. The vibe-coding goblin is someone exploiting LLMs to drain every last drop of code out of them with absolutely zero interest in what the code means nor how it works. These people are purely result driven and unapologetically moving fast and breaking things. On the other end of the spectrum is the LLM hermit. The LLM hermit hates the fact that people are using LLMs at all, they use stack overflow exclusively, outlaw all usage of LLMs in their own home but truly try to solve problems on their own to gain an in-depth understanding of what is going on in the code. However, they are getting wayyy less done than the vibe-coding goblin but have much better fundamental CS knowledege.

Vibe-Coding Goblin <---------------------------------------------------> LLM Hermit

Somewhere in between there is a golden ratio and my recently declared mission is to find this elusive goldilocks zone! This project was a voyage to explore this area in between. I hand-typed every line of code in this project I did not copy and paste or have claude write any code for me. Instead, I spent half an hour making a cs-tutor SKILL.md file for claude code to reference. Instead of code, claude asked me questions pushed me to think for myself, help me derive the math behind the code myself, and write the code on my own. Through this process, I noticed that I actually understand why every single line of code is needed, but also I didn't waste hours trying to find a solution on the web. It was not super fast to build, but it was definitely faster than the LLM Hermit's iteration. 

I would like to argue that this approach to use LLMs is the best possible method that I have discovered, to balance learning code (or just learning in general), learning to work with LLMs, and iterating faster. Maybe the line above is not so linear, and the best attributes of the Vibe-Coding Goblin and the LLM Hermit combined will make up the attributes of the top engineers of tomorrow! Btw 80% of the rest of this README was written by Claude 😂 (I did the math derivations but I was too lazy write it in the README myself)

---

## How It Works (High Level)

1. Define the 6 faces of a cube, each with a starting corner, two direction vectors, and a normal vector
2. Each frame, rotate every face's normal vector using the combined rotation matrix `R = Rz · Ry · Rx`
3. Sample points across each face's surface and project them to 2D screen coordinates
4. Use Z-buffering to decide which face wins at each screen position when faces overlap
5. Loop with `requestAnimationFrame` to animate the cube

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

Take the product of all three rotations:
Where `Rx, Ry, Rz` = the result rotation vectors of the perspective axis and `R` is the final rotation,

---

## Projection (3D → 2D Screen)

To draw a 3D point on a flat screen, we use perspective projection:

```
x' = x · (z' / z)
y' = y · (z' / z)
```

Where:

- `z'` = distance from the camera to the screen
- `z` = distance from the camera to the point

---

## Surface Rendering

Each face of the cube is rendered by sampling points across its surface using two perpendicular direction vectors (tangent vectors). For each sampled point:

```
point = corner + u * direction1 + v * direction2
```

Where `u` and `v` step across the face in small increments.

All points on the same flat face share the same normal vector, one entire face gets a predetermined **ASCII character** that does not change once initialized

---

## renderFace()

1. Sample point → corner + u*dir1 + v*dir2
2. Rotate the point (apply rotateX, rotateY, rotateZ)
3. Project to 2D
4. Shift math centered coordinates to buffer-centered (add `WIDTH/2` and `HEIGHT/2`)
5. Round the floats to integer indices
6. Write to buffer

---

## Z-Buffering

When multiple surfaces overlap on screen, Z-buffering decides which one to draw by keeping track of the depth (z-value) at each pixel position — the closest surface wins.

Shout out if you read this whole thing!

Here's a quote I got off Google as your reward:

“There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.” - Ernest Hemingway
