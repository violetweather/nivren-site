function kernel(value, salt) {
  return (value + salt) * 2;
}

let result = 0;
for (let index = 0; index < 2_000_000; index += 1) {
  result = kernel(index, 3);
}
console.log(result);
