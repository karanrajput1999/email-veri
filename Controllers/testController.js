class Test {
    async testPrint(data) {
        console.log(data);
    }

    async testPrint2(data) {
        console.log(this);
        this.testPrint(data);
    }
}

module.exports = new Test();