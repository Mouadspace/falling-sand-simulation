const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const backgroundColor = "#f6f6f6";

class Grid {
  constructor(size, rows, cols) {
    this.size = size;
    this.rows = rows;
    this.cols = cols;
    this.grid = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      const row = [];
      for (let c = 0; c < this.cols; c++) {
        const cell = new Cell(this.size, this.grid, this.rows, this.cols, r, c);
        row.push(cell);
      }
      this.grid.push(row);
    }
  }

  draw() {
    canvas.width = this.size;
    canvas.height = this.size;
    canvas.style.background = backgroundColor;

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        cell.drawCell();
      });
    });

    // this.grid[10][10].color = "red";

    requestAnimationFrame(() => {
      this.draw();
    });
  }
}

class Cell {
  constructor(parentSize, parentGrid, rows, cols, rowPos, colPos) {
    this.parentSize = parentSize;
    this.parentGrid = parentGrid;
    this.rows = rows;
    this.cols = cols;
    this.rowPos = rowPos;
    this.colPos = colPos;
    this.size = this.parentSize / this.cols;
    this.color = backgroundColor;
  }

  setColor() {
    this.color = "red";
  }

  drawCell() {
    const x = this.rowPos * this.size;
    const y = this.colPos * this.size;

    ctx.strokeStyle = "#fff";
    ctx.fillStyle = this.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(x, y, this.size, this.size);
    ctx.fill();
    ctx.stroke();

    // ctx.fillRect(x, y, this.size, this.size);
  }
}

const grid = new Grid(500, 20, 20);
grid.setup();
grid.draw();

canvas.addEventListener("mousedown", (e) => {
  const cellX = Math.floor(e.offsetX / 25);
  const cellY = Math.floor(e.offsetY / 25);

  grid.grid[cellX][cellY].setColor();
  console.log(cellX, cellY);
});
