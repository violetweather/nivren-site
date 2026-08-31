function fibonacci(value) {
  if (value < 2) return value;
  return fibonacci(value - 1) + fibonacci(value - 2);
}

console.log(fibonacci(34));
