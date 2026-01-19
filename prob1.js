function fun(arr, target) {
    let op = [];
    let num = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = arr.length-1 ; j >= 0 ; j--) {
            let flag = 0;
           for (let k = 0; k < num.length; k++){          
                if (num[k] == i || num[k] == j) {
                    flag = 1;
                    break;
                }
            }
           if (flag == 1 ) {
                break;
           }
           if (arr[i] + arr[j] == target) {
                let subArr = [i,j];
                op.push(subArr);
                num.push(i)
                num.push(j)
                break;
           }
        }
        
    }
    return op;
}

const arr = [2, 7, 11, 15, 3, 6]
target = 9
let op = fun(arr, target);

for (let i = 0; i < op.length; i++) {
    for (let j = 0; j < op[i].length; j++) {
        console.log(op[i,j]+" ");        
    }    
    
}
