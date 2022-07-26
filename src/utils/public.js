import useClipboard from 'vue-clipboard3'

export const formatDecimal = (num, decimal=2) => {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}

export const {toClipboard} = useClipboard()



export const format = (time, format) => {
    let t = new Date(time);
    let tf = function (i) {
        return (i < 10 ? "0" : "") + i;
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case "yyyy":
                return tf(t.getFullYear());
                break;
            case "MM":
                return tf(t.getMonth() + 1);
                break;
            case "mm":
                return tf(t.getMinutes());
                break;
            case "dd":
                return tf(t.getDate());
                break;
            case "HH":
                return tf(t.getHours());
                break;
            case "ss":
                return tf(t.getSeconds());
                break;
        }
    });
}

export const parseTo = (num, point = 2) => {
    let sFloat = formatDecimal((num / 1000000), point)
    return parseFloat(sFloat)
}

export const parseWalletTo = (num, point = 2) => {
    const DECIMAL = process.env.VUE_APP_CHAIN_DECIMAL //精度
    let sFloat = formatDecimal((num / DECIMAL), point)
    return parseFloat(sFloat)
}


export const dateToTs = (date) => {
    return new Date(date).getTime();
}

export const parseToThousandth = (num, point = 2) => {
    let m = ''
    if (num > 10000) {
        num = num / 10000
        m = 'W'
    }
    if (num > 10000) {
        num = num / 10000
        m = 'Y'
    }
    let [sInt, sFloat] = (Number.isInteger(num) ? `${num}` : num.toFixed(point)).split('.');
    sInt = sInt.replace(/\d(?=(\d{3})+$)/g, '$&,');
    return sFloat ? `${sInt}.${sFloat}` + m : `${sInt}` + m;
}

const accDiv = (arg1, arg2) => {
    let t1 = 0, t2 = 0, r1, r2;
    try {
        t1 = arg1.toString().split(".")[1].length
    } catch (e) {
    }
    try {
        t2 = arg2.toString().split(".")[1].length
    } catch (e) {
    }
    r1 = Number(arg1.toString().replace(".", ""))
    r2 = Number(arg2.toString().replace(".", ""))
    return accMul((r1 / r2), Math.pow(10, t2 - t1));

}
// 乘法

const accMul = (arg1, arg2) => {
    let m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

export const toFixedTwo = (n, to=2) => {
    // if (!isNaN(n)) {
    //     console.error("Error:n not is Number")
    //     return false
    // }
    return formatDecimal((Math.round(accMul(n, 100)) / 100), to)
}
