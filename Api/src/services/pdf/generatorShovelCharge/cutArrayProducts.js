function cutArrayProducts(data){
  const primerosOcho = data.slice(0, 6);
  const restantes = data.slice(6);

  const subarrays = [];
  subarrays.push(primerosOcho);

  while (restantes.length > 0) {
    subarrays.push(restantes.splice(0, 20));
  }

  return subarrays;
}


module.exports = cutArrayProducts