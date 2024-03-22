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
    // PLACE RANDOM PIXEL PLACES
    for (let index = 0; index < 500; index++) {
      const rand = Math.floor(Math.random() * 2499);
      this.grid[rand].state = 1;
    }
  }

  draw() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[this.rows * i + j].drawCell();
      }
    }
  }

  updateCells() {
    const visited = [];
    for (let i = 0; i < this.rows - 1; i++) {
      for (let j = 0; j < this.cols; j++) {
        const below = this.grid[this.rows * (i + 1) + j];
        const current = this.grid[this.rows * i + j];

        if (current.state && !below.state && !visited.includes(current)) {
          visited.push(below);
          this.swapeState(below, current);
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
  }

  drawCell() {
    const x = this.size * this.posX;
    const y = this.size * this.posY;
    const size = this.size;

    context.fillStyle = this.state ? "#fff" : "#000";
    context.fillRect(x, y, size, size);
  }
}

const myGrid = new Grid(WIDTH, 50, 50);
myGrid.setup();
myGrid.draw();

const loop = () => {
  myGrid.updateCells();
  myGrid.draw();

  requestAnimationFrame(() => {
    loop();
  });
};

loop();
