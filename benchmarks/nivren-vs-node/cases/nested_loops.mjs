let checksum = 0;
for (let row = 0; row < 2000; row += 1) {
  for (let column = 0; column < 2000; column += 1) {
    checksum += (row * 17 + column * 31) % 1000;
  }
}
console.log(checksum);
