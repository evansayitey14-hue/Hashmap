class Node {
    constructor(key,value){
        this.key = key;
        this.value = value;
        this.next = null;

    }
}

class HashMap {
    constructor(loadFactor = 0.75,capacity = 16){
        this.loadFactor = loadFactor;
        this.capacity = capacity;
        this.bucket = new Array(capacity).fill(null);
    }

    hash(key){
        let hashCode = 0;

        const primeNumber = 31;
        for(let i = 0; i < key.length; i++){
            hashCode = (primeNumber * hashCode + key.charCodeAt(i));
        }

        return hashCode % this.capacity;

    }

    set(key,value){
        const index = this.hash(key);
        if(this.bucket[index] === null){
            this.bucket[index] = new Node(key,value);
        } else {
            let current = this.bucket[index];
            while (current) {
                if(current.key === key){
                    current.value = value;
                    return;
                }
                if(current.next === null){
                    current.next = new Node(key, value);
                    return;
                }
                current = current.next;
            }
        }


    }
        
      

    get(key){
        const index = this.hash(key);
        let current = this.bucket[index];

        while(current){
            if(current.key === key){
                return current.value;
            }
            current = current.next;
        }
        return null;
        

    }

    has(key){
        const index = this.hash(key);
        let current = this.bucket[index];
        
        while(current){
                if(current.key === key){
                    return true
                }
                current = current.next;

        }

        return false;
    }



    remove(key){
        let index = this.hash(key);
        let current = this.bucket[index];
        let previous = null;


        while(current){
            if(current.key === key){
                if(previous === null){
                    this.bucket[index] = current.next;

                } else {
                    previous.next = current.next;
                }

                return true
            }
            previous = current;
            current = current.next;
        }
        return false;
    }


    length(){
        let count = 0;
        for(let i = 0; i < this.bucket.length;i++){
            let current = this.bucket[i];
            while(current) {
                count++;
                current = current.next;
            }

        }
        return count;
        
    }

    keys(){
        let array = [];
        for(let i = 0; i < this.bucket.length;i++){
            let current = this.bucket[i];
            while(current){
                    array.push(current.key);
                    current = current.next;
                
            }
        };
        return array
    }

    value(){
        let array = [];
        this.bucket.forEach(bucket => {

            let current = bucket;
            while(current){
                array.push(current.value);
                current = current.next;
            }
        })

        return array;
    }

    entries(){
        let array = [];
        this.bucket.forEach(bucket => {

            let current = bucket;
            while(current){
                let entry = [(current.key),(current.value)];

                array.push(entry);
                current = current.next;
            }
            
        })

        return array;
    }
}
let hashMap = new HashMap();

hashMap.set('apple', 'red')
hashMap.set('banana', 'yellow')
hashMap.set('carrot', 'orange')
hashMap.set('dog', 'brown')
hashMap.set('elephant', 'gray')
hashMap.set('frog', 'green')
hashMap.set('grape', 'purple')
hashMap.set('hat', 'black')
hashMap.set('ice cream', 'white')
hashMap.set('jacket', 'blue')
hashMap.set('kite', 'pink')
hashMap.set('lion', 'golden')
hashMap.set('cobra','black');




console.log(hashMap.get('cobra'));



