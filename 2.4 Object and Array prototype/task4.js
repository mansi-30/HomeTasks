function compose(f,g) {
    // Compose the two functions here!
    return (...args) => f(g(...args));
  }
