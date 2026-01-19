class NumberCollection {

    arr = [];
    

    add(x){
        this.arr.push(x);
    }

    remove(x) {
        let newArr =this.arr.filter( value => x !== value );
        this.arr = [...newArr];
    }

    getMax() {
        let max = this.arr[0] || null;
        for (let index = 0; index < this.arr.length; index++) {
            if (this.arr[index] > max) {
                max = this.arr[index];
            }            
        }
        console.log(max? max : "Array is empty");
         
    }
    getMin() {
        let min = this.arr[0] || null;
        for (let index = 0; index < this.arr.length; index++) {
            if (this.arr[index] < min) {.-,zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
                min = this.arr[index];
            }
        }
        console.log( min ? min : "Array is empty");
    }

}

collection = new NumberCollection();
collection.add(5);
collection.add(2);
collection.add(8);
collection.getMax();
collection.getMin();
collection.remove(2);
collection.getMax();
collection.getMin();


