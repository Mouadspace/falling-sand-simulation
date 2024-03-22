const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.width = WIDTH;
canvas.height = HEIGHT;

class Grid {
  constructor(size, rows, cols) {
    this.size = WIDTH;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
  }

  setup() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = new Cell(i, j, this.rows, this.cols);
        this.grid.push(cell);
      }
    }
    // PLACE RANDOM PIXEL
    for (let index = 0; index < 100; index++) {
      //BUG : 10 + shift, Invisible Interaction
      const i = Math.floor(Math.random() * GRID_ROWS);
      const j = Math.floor(Math.random() * GRID_COLS);
      const rand = this.cols * i + j;
      this.grid[rand].state = 1;
    }
  }

  setPixel(i, j) {
    this.grid[this.rows * j + i].state = 1;
  }

  draw() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[this.rows * i + j].drawCell();
      }
    }

    const size = this.size / this.rows;
    if (mouse.box) {
      context.fillRect(mouse.box.gx * size, mouse.box.gy * size, size, size);
    }
  }

  isBelowEmpty(i, j) {
    return this.grid[this.rows * (i + 1) + j].state === 0;
  }
  isBelowLeftEmpty(i, j) {
    return j > 0 && this.grid[this.rows * (i + 1) + j - 1].state === 0;
  }
  isBelowRightEmpty(i, j) {
    return (
      j < this.cols - 1 && this.grid[this.rows * (i + 1) + j + 1].state === 0
    );
  }

  updateCells() {
    const visited = [];
    for (let i = 0; i < this.rows - 1; i++) {
      for (let j = 0; j < this.cols; j++) {
        const below = this.grid[this.rows * (i + 1) + j];
        const belowLeft = this.grid[this.rows * (i + 1) + j - 1];
        const belowRight = this.grid[this.rows * (i + 1) + j + 1];
        const current = this.grid[this.rows * i + j];

        const isbEmpt = this.isBelowEmpty(i, j);
        const isblEmpty = this.isBelowLeftEmpty(i, j);
        const isbrEmpty = this.isBelowRightEmpty(i, j);

        if (current.state && !visited.includes(current)) {
          if (isbEmpt) {
            visited.push(below);
            this.swapeState(below, current);
          } else if (isblEmpty && isbrEmpty) {
            const rand = Math.floor(Math.random() * 2);
            const cell = rand ? belowLeft : belowRight;
            visited.push(cell);
            this.swapeState(cell, current);
          } else if (isblEmpty) {
            visited.push(belowLeft);
            this.swapeState(belowLeft, current);
          } else if (isbrEmpty) {
            visited.push(belowRight);
            this.swapeState(belowRight, current);
          }
        }
      }
    }
  }

  swapeState(cell1, cell2) {
    const temp = cell1.state;
    cell1.state = cell2.state;
    cell2.state = temp;
  }
}

class Cell {
  constructor(i, j, rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.posX = j;
    this.posY = i;
    this.size = WIDTH / this.cols;
    this.state = 0;
    this.color = this.varyColor(CELL_COLOR);
  }

  drawCell() {
    const x = this.size * this.posX;
    const y = this.size * this.posY;
    const size = this.size;

    context.fillStyle = this.state ? this.color : BG_COLOR;
    context.fillRect(x, y, size, size);
  }
  varyColor = (color) => {
    const rgb = hex2RGB(color);
    let [h, s, l] = RGBToHSL(rgb);
    s = s + getRandomArbitrary(-20, 0);
    s = constrain(s, 0, 100);

    l = l + getRandomArbitrary(-10, 10);
    l = constrain(l, 0, 100);
    return hsl2RGB(h, s, l);
  };
}

let startClick = false;
let onMove = false;
const mouse = {};
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.pageX;
  mouse.y = e.pageY;
  updateMouse();
});
canvas.addEventListener("mousedown", (e) => (startClick = true));
canvas.addEventListener("mouseup", (e) => (startClick = false));

const myGrid = new Grid(WIDTH, GRID_ROWS, GRID_COLS);
myGrid.setup();
myGrid.draw();

const loop = () => {
  myGrid.updateCells();
  myGrid.draw();

  if (startClick) {
    myGrid.setPixel(mouse.box.gx, mouse.box.gy);
  }

  requestAnimationFrame(() => {
    loop();
  });
};
const updateMouse = () => {
  if (!mouse.box) {
    mouse.box = {};
  }

  mouse.box.x = mouse.x - (innerWidth - WIDTH) / 2;
  mouse.box.y = mouse.y - (innerHeight - WIDTH) / 2;
  mouse.box.nx = mouse.box.x / WIDTH;
  mouse.box.ny = mouse.box.y / HEIGHT;
  mouse.box.gx = Math.floor(mouse.box.nx * GRID_ROWS);
  mouse.box.gy = Math.floor(mouse.box.ny * GRID_ROWS);
};

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const constrain = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

loop();
