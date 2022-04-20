//https://www.codewars.com/kata/525a037c82bf42b9f800029b/train/javascript

function partitionOn(pred, items) {
  
    let _true = items.filter(d=>pred(d));
    let _false = items.filter(d=>!pred(d));

    items.length = 0;
    items.push.apply(items,_false.concat(_true));
    return items.indexOf(_true[0]);
    
  }
