class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

let total = 0;
for (let index = 0; index < 300000; index += 1) {
  const point = new Point(index, index * 2, index % 7);
  total += point.x + point.z;
}
console.log(total);
