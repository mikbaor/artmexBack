

//creamos un prototype para slice de los textos

String.prototype.sliceName = function(){
    if (this.length > 17) {
        return this.slice(0, 14 ).split().join() + '...';
    }
    return this;
}

String.prototype.sliceTipo = function(){
    if (this.length > 14) {
        return this.slice(0, 11).split().join() + '...';
    }
    return this;
}


String.prototype.sliceDescription = function(){
    if (this.length > 20) {
        return this.slice(0, 17).split().join() + '...';
    }
    return this;
}
