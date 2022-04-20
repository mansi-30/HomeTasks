function isSantaClausable(obj) {
    return ['sayHoHoHo', 'distributeGifts', 'goDownTheChimney']
      .every(meth => typeof obj[meth] === 'function'); 
  }
