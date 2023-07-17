String.prototype.sliceName = function () {
    if (this.length > 40) {
        return this.slice(0, 37).split().join() + '...';
    }
    return this;
}