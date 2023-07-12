function cutArrayProducts(data){
    // if(data.length <= 8){
    //     return data
    // }


    const primerosOcho = data.slice(0, 8);
    const restantes = data.slice(8);
  
    const subarrays = [];
    subarrays.push(primerosOcho);
  
    while (restantes.length > 0) {
      subarrays.push(restantes.splice(0, 20));
    }
  
    return subarrays;
}


module.exports = cutArrayProducts