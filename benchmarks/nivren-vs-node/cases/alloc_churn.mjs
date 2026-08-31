let total = 0;
for (let index = 0; index < 150000; index += 1) {
  const triplet = [index, index + 1, index + 2];
  const label = "event-".concat(String(index));
  total += triplet[2] + label.length;
}
console.log(total);
