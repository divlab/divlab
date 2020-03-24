/*
 *
 * demo
 * */

var a = 123;
(function f() {
    if (typeof a === 'undefined') {
        var a = 456;
        console.log('hello,i m' + a)
    } else {
        console.log('hi,i m' + a)
    }

})()
//猜结果 hi， im 456


//bind、call、apply的区别与实现原理

Function.prototype.myBind = function() {
    var _this = this;
    var context = [].shift.call(arguments); // 保存需要绑定的this上下文
    var args = [].slice.call(arguments); //剩下参数转为数组
    console.log(_this, context, args);
    return function() {
        return _this.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
};

/**
 * 每个函数都可以调用call方法，来改变当前这个函数执行的this关键字，并且支持传入参数
 */
Function.prototype.myCall = function(context) {
    //第一个参数为调用call方法的函数中的this指向
    var context = context || global;
    //将this赋给context的fn属性
    context.fn = this; //此处this是指调用myCall的function

    var arr = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
        arr.push("arguments[" + i + "]");
    }
    //执行这个函数，并返回结果
    var result = eval("context.fn(" + arr.toString() + ")");
    //将this指向销毁
    delete context.fn;
    return result;
}

/**
 * apply函数传入的是this指向和参数数组
 */
Function.prototype.myApply = function(context, arr) {
    var context = context || global;
    context.fn = this;
    var result;
    if (!arr) {
        result = context.fn(); //直接执行
    } else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push("arr[" + i + "]");
        }
        result = eval("context.fn([" + args.toString() + "])");
    }
    //将this指向销毁
    delete context.fn;
    return result;
}


//*
//
//
//
// */


let xx = {};

xx.a = 1
xx.b = 2

console.log(xx[Object.keys(xx)[0]]); //1

//---------------------

var scope = 'global scope';

function check() {

    var scope = 'lacal scope';

    function f() {
        return scope
    }
    return f
}

console.log(check()()) //lacal scope


function constfuns() {
    var funs = [];
    for (var /* let 5*/ i = 0; i < 10; i++) {
        funs[i] = function() {
            return i
        }
    }
    return funs
}

var funs = constfuns();
console.log(funs[5]()); //

//*
//
//
//
// */

function addMethod(object, name, f) {
    var old = object[name];
    object[name] = function() {
        // f.length为函数定义时的参数个数
        // arguments.length为函数调用时的参数个数
        if (f.length === arguments.length) {
            return f.apply(this, arguments);
        } else if (typeof old === "function") {
            return old.apply(this, arguments);
        }
    };
}

// 不传参数时，返回所有name
function find0() {
    return this.names;
}

// 传一个参数时，返回firstName匹配的name
function find1(firstName) {
    var result = [];
    for (var i = 0; i < this.names.length; i++) {
        if (this.names[i].indexOf(firstName) === 0) {
            result.push(this.names[i]);
        }
    }
    return result;
}

// 传两个参数时，返回firstName和lastName都匹配的name
function find2(firstName, lastName) {
    var result = [];
    for (var i = 0; i < this.names.length; i++) {
        if (this.names[i] === firstName + " " + lastName) {
            result.push(this.names[i]);
        }
    }
    return result;
}

var people = {
    names: ["Dean Edwards", "Alex Russell", "Dean Tom"]
};

addMethod(people, "find", find0);
addMethod(people, "find", find1);
addMethod(people, "find", find2);

console.log(people.find()); // 输出["Dean Edwards", "Alex Russell", "Dean Tom"]
console.log(people.find("Dean")); // 输出["Dean Edwards", "Dean Tom"]
console.log(people.find("Dean", "Edwards")); // 输出["Dean Edwards"]