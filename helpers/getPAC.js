function getPAC(TS){
    switch (TS) {
        case -11:
            return {PAClb: 280, PACub: 299};
        case -18:
            return {PAClb: 400, PACub: 419} 
    }
}

export default getPAC