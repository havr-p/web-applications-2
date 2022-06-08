

const $e = (elName, cl, parEl) => {//{{{
  let e = document.createElement (elName);
  if (cl) e.classList.add (cl);
  if (parEl) parEl.appendChild (e);
  return e;
}//}}}
function readAsTextAsync (file) {//{{{
  return new Promise ((resolve, reject) => {
    let reader = new FileReader ();
    reader.onload = () => {
      resolve (reader.result);
    };
    reader.onerror = () => {
      reader.abort ();
      reject (new Error ('readAsText problem.'));
    }
    reader.readAsText (file);
  })
}//}}}

let socket = io();



class Histogram {
  #txt = '';

  constructor (elem=document.body) {
    this.root = $e ('div', 'Histogram_root', elem);
    this.graph = $e ('div', 'Histogram_graph', this.root);
    let el = this.textarea = $e ('textarea', 'Histogram_text', this.root);
    el.rows = 5;
    el.cols = 100;
    el.placeholder = 'Sem napíš text';

    //setInterval (this.make.bind(this), 3000);
    this.textarea.addEventListener('input', e => {
      this.make();
    });

    this.textarea.addEventListener('dragenter', e => {
      this.textarea.style.backgroundColor = 'yellow';
    });
    this.textarea.addEventListener('dragleave', e => {
      this.textarea.style.backgroundColor = 'white';
    });
    this.textarea.addEventListener('dragover', e => {
      this.textarea.style.backgroundColor = 'yellow';
      e.preventDefault();
    });
    this.textarea.addEventListener('drop', async e => {
      this.textarea.style.backgroundColor = 'white';
      e.preventDefault();
      let txt = '';
      for (let f of e.dataTransfer.files) {
        console.log(f.type, f.name, f.size);
        if (f.type == 'text/plain') {
          txt += await readAsTextAsync(f);
        }
      }
      this.textarea.value = txt;
      this.make();
    });
    document.addEventListener('dragover', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());

    this.worker = new Worker('worker.js');
    this.worker.onmessage = e => {
      performance.mark('end');
      performance.measure('meranie', 'start', 'end');
    let m = performance.getEntriesByName('meranie');
    console.log(`W: Cas dodavky = ${m[m.length-1].duration} ms`);
      this.render(e.data);
    };
  }
  render (data) {
    // data = [['a', 0.2],['x', 1.0], ...]

    this.graph.textContent = '';
    let box = this.graph.getBoundingClientRect ();
    let scale = box.height - 30;

    for (let [c, s] of data) {
      let el = $e ('div', 'Histogram_col', this.graph);
      
      let el2 = $e ('div', 'Histogram_bar', el);
      el2.style.height = s * scale + 'px';

      el2 = $e ('div', 'Histogram_char', el);
      el2.textContent = c;
    }
  }

  get text () {
    return this.textarea.value;
  }

  make () { 
    let txt = this.text;
    if (txt == this.#txt) return;
    this.#txt = txt;
    performance.mark('start');

    this.worker.postMessage(txt);

    
    //--worker.js

  }
}



document.addEventListener ('DOMContentLoaded', () => {
   new Histogram ();
});




