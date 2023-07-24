

//creamos un prototype para slice de los textos


String.prototype.sliceName = function () {
    let temp = this.replace(/@\s?/g, ' ').replace(/\s+/g, ' ');

    return temp;
}

String.prototype.sliceDescription = function () {
    let temp = this.replace(/@\s?/g, ' ').replace(/\s+/g, ' ');

    if (temp.length > 25) {
        return temp.slice(0, 22).split().join() + '...';
    }
    return temp;
}

String.prototype.sliceTipo = function () {
    if (this.length > 14) {
        return this.slice(0, 11).split().join() + '...';
    }
    return this;
}
