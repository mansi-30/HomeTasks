function getMiddle(s)
{
    var i = Math.floor(s.length / 2);
    var result = s[i];  
    if(s.length % 2 === 0 && i > 0) {
      result = s[i-1] + result;
    }
    return result;
}
