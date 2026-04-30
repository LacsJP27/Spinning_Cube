const cube = document.getElementById('cube');
const WIDTH = 80;
const HEIGHT = 40;

function createBuffer() {
    const buffer = [];
    for (let y = 0; y < HEIGHT; y++) {
        buffer[y] = [];
        for (let x = 0; x < WIDTH; x++) {
            buffer[y][x] = ' ';
        }
    }

    return buffer;
}

function renderBuffer(buffer) {
    let res = '';
    for (let y = 0; y < buffer.length ; y++) {
        for (let x = 0; x < buffer[0].length; x++) {
            res += buffer[y][x];
        }
        res += '\n'; 
    }
    cube.innerText = res
}

const buffer = createBuffer();
buffer[20][40] = '@';
renderBuffer(buffer);
