const cube = document.getElementById('cube');
const WIDTH = 80;
const HEIGHT = 80;
const CAMERA_TO_SCREEN = 45;
const NUM_POINT_SAMPLES = 40;
const ROTATION_RATE = 0.01;
const OFFSET_VAL = 4;

class Square {
	constructor(
		corner = [0, 0, 0],
		dir1 = [0, 0, 0],
		dir2 = [0, 0, 0],
		normal = [0, 0, 0],
		char = '0',
	) {
		this.corner = corner;
		this.dir1 = dir1;
		this.dir2 = dir2;
		this.normal = normal;
		this.char = char;
	}
}

function createBuffer(zBuffer = false) {
	const buffer = [];
	for (let y = 0; y < HEIGHT; y++) {
		buffer[y] = [];
		for (let x = 0; x < WIDTH; x++) {
			if (zBuffer) {
				buffer[y][x] = Infinity;
				continue;
			}
			buffer[y][x] = ' ';
		}
	}

	return buffer;
}

function renderBuffer(buffer) {
	let res = '';
	for (let y = 0; y < buffer.length; y++) {
		for (let x = 0; x < buffer[0].length; x++) {
			res += buffer[y][x];
		}
		res += '\n';
	}
	cube.innerText = res;
}

function rotateX(point, alpha) {
	// x*1
	const [x, y, z] = point;
	const xp = x;
	const yp = y * Math.cos(alpha) - z * Math.sin(alpha);
	const zp = y * Math.sin(alpha) + z * Math.cos(alpha);

	return [xp, yp, zp];
}

function rotateY(point, alpha) {
	const [x, y, z] = point;
	const xp = x * Math.cos(alpha) + z * Math.sin(alpha);
	const yp = y;
	const zp = x * -Math.sin(alpha) + z * Math.cos(alpha);

	return [xp, yp, zp];
}

function rotateZ(point, alpha) {
	const [x, y, z] = point;
	const xp = x * Math.cos(alpha) - y * Math.sin(alpha);
	const yp = x * Math.sin(alpha) + y * Math.cos(alpha);
	const zp = z;

	return [xp, yp, zp];
}

function projection(point) {
	const [x, y, z] = point;
	const xp = x * (CAMERA_TO_SCREEN / (z + OFFSET_VAL)) * 1.5;
	const yp = y * (CAMERA_TO_SCREEN / (z + OFFSET_VAL));

	return [xp, yp];
}

function pointOutOfBounds(point) {
	const outOfBounds =
		point[0] < 0 ||
		point[0] > WIDTH - 1 ||
		point[1] < 0 ||
		point[1] > HEIGHT - 1;

	return outOfBounds;
}

function renderFace(face, angleX, angleY, angleZ, buffer, zBuffer) {
	const sampleStep = 2 / NUM_POINT_SAMPLES;
	for (let u = 0; u <= 2; u += sampleStep) {
		for (let v = 0; v <= 2; v += sampleStep) {
			const point = new Array(3);
			point[0] = face.corner[0] + u * face.dir1[0] + v * face.dir2[0];
			point[1] = face.corner[1] + u * face.dir1[1] + v * face.dir2[1];
			point[2] = face.corner[2] + u * face.dir1[2] + v * face.dir2[2];

			// R = Rz * Ry * Rx
			const rotated = rotateZ(rotateY(rotateX(point, angleX), angleY), angleZ);
			const projected = projection(rotated);
			const buffIdx = [
				Math.round(projected[0] + WIDTH / 2),
				Math.round(projected[1] + HEIGHT / 2),
			];

			if (pointOutOfBounds(buffIdx)) continue;

			// buffer is buffer[y][x]
			if (rotated[2] < zBuffer[buffIdx[1]][buffIdx[0]]) {
				zBuffer[buffIdx[1]][buffIdx[0]] = rotated[2];
				buffer[buffIdx[1]][buffIdx[0]] = face.char;
			}
		}
	}

	return buffer;
}

function animate(faces, angleX, angleY, angleZ) {
	const buffer = createBuffer();
	const zBuffer = createBuffer(true);
	// Convert degrees to radians and pass to Math.sin

	angleX += ROTATION_RATE;
	angleY += ROTATION_RATE;
	angleZ += ROTATION_RATE;
	for (const face of faces) {
		renderFace(face, angleX, angleY, angleZ, buffer, zBuffer);
	}
	renderBuffer(buffer);
	requestAnimationFrame(() => animate(faces, angleX, angleY, angleZ));
}

const faces = new Array(6);
// front
faces[0] = new Square([-1, -1, 1], [1, 0, 0], [0, 1, 0], [0, 0, 1], '+');
// back
faces[1] = new Square([-1, -1, -1], [1, 0, 0], [0, 1, 0], [0, 0, -1], '~');
// left
faces[2] = new Square([-1, -1, -1], [0, 0, 1], [0, 1, 0], [-1, 0, 0], ';');
// right
faces[3] = new Square([1, -1, 1], [0, 0, -1], [0, 1, 0], [1, 0, 0], '.');
// top
faces[4] = new Square([-1, 1, 1], [0, 0, -1], [1, 0, 0], [0, 1, 0], '^');
// bottom
faces[5] = new Square([-1, -1, 1], [1, 0, 0], [0, 0, -1], [0, -1, 0], '|');

animate(faces, 0, 0, 0);
