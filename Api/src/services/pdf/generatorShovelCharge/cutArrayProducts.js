function cutArrayProducts(data, cutArray = 5){
  const primerosOcho = data.slice(0, cutArray);
  const restantes = data.slice(cutArray);

  const subarrays = [];
  subarrays.push(primerosOcho);

  while (restantes.length > 0) {
    subarrays.push(restantes.splice(0, 20));
  }

  return subarrays;
}


module.exports = cutArrayProducts