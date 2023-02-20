function fnum(x) {
    if(isNaN(x)) return x;

    if(x < 999) {
        return x;
    }else if(x < 1000000) {
        return Math.round(x/1000) + "K";
    }else if( x < 10000000) {
        return (x/1000000).toFixed(2) + "M";
    }else if(x < 1000000000) {
        return Math.round((x/1000000)) + "M";
    }else if(x < 1000000000000) {
        return Math.round((x/1000000000)) + "B";
    }

    return "1T+";
}

exports.fnum() = fnum;