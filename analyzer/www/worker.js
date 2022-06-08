onmessage = e => {
    let txt = e.data;
    performance.mark('start');
    //-------------------------------
    txt = txt.toUpperCase();

    let hist = new Map();
    let max = 0;

    for (let c of txt) {
        if (!hist.has(c)) hist.set(c, 0);

        let n = hist.get(c) + 1;
        hist.set(c, n);

        if (n > max) max = n;
    }

    let data = [];
    for (let [c, n] of hist) data.push([c, n / max]);

    data.sort(([, a], [, b]) => b - a);
    performance.mark('end');
    //---------------------------------
    performance.measure('meranie', 'start', 'end');
    let m = performance.getEntriesByName('meranie');
    console.log(`W: Cas spracovania = ${m[m.length-1].duration} ms`);
    postMessage(data);
}