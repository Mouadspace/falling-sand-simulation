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
