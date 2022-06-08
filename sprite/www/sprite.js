const $e = (elName, cl, parEl) => {//{{{
  let e = document.createElement (elName);
  if (cl) e.classList.add (cl);
  if (parEl) parEl.appendChild (e);
  return e;
}//}}}
function loadImageAsync (src) {//{{{
  return new Promise ((resolve, reject) => {
    let img = $e('img');
    img.addEventListener ('load', () => {resolve (img)});
    img.addEventListener ('error', () => {reject (new Error (`Failed to load image: ${src}`))});
    img.src = src;
  });
}//}}}


class Sprite {
  constructor (filename, rows, cols) {//{{{
    // Obalka div
    this.rootElem = $e ('div');
    this.rootElem.style.position = 'absolute';

    // Pozicia obalky
    this.x = 0;
    this.y = 0;

    // Suradnice faz v obrazku pozadia
    this.bgXY = [];
    // Rozmer okienka jednej fazy animacie
    this.frameWidth = 0;
    this.frameHeight = 0;

    // Fazy na animovanie
    this.phases = null;
    // Aktualne beziaca animacia
    this.anim = null;
    // Smer pohybu pri animacii
    this.dirx = 1;
    this.diry = 1;


    // Moznost pockat na inicializaciu
    this.ready = this.init (filename, rows, cols);
  }//}}}
  async init (filename, rows, cols) {//{{{
    let img = await loadImageAsync(filename);
    this.frameWidth = Math.round(img.width / cols);
    this.frameHeight = Math.round(img.height / rows);

    this.rootElem.style.width = this.frameWidth + 'px';
    this.rootElem.style.height = this.frameHeight + 'px';

    this.rootElem.style.backgroundImage = `url('${filename}')`;

    for (let i = 0; i < rows; i++) 
      for (let j = 0; j < cols; j++) {
        this.bgXY.push({x: j*this.frameWidth, y: i*this.frameHeight});
      }

  }//}}}

  show () {//{{{
    document.body.appendChild(this.rootElem);
  }//}}}
  hide () {//{{{
    this.rootElem.remove();
  }//}}}
  setPos (x, y) {//{{{
    this.x = x;
    this.y = y;
    this.rootElem.style.left = x + 'px';
    this.rootElem.style.top = y + 'px';
  }//}}}

  set (...args) {//{{{
    if (args.length >= 2) {
      this.set(args[0]);
      this.phases = [];
      for (let i = args[0]; i < args[1]; i++) {
        this.phases.push(i);
      }
    }
    else if (typeof args[0] == 'number') {
      let {x, y} = this.bgXY[args[0]];
      this.rootElem.style.backgroundPosition = `-${x}px -${y}px`;
      this.phases = null;
    }
    else {
      this.set(args[0][0]);
      this.phases = args[0];
    }
  }//}}}
  async start (dx=0, dy=0, loop=false, check=true) {//{{{
    if (!this.phases) return;
    this.loop = loop;
    do {
      let kframes = [];
    for (let p of this.phases) {
      this.x += dx * this.dirx;
      this.y += dy * this.diry;

      kframes.push({
        left: this.x + 'px',
        top: this.y + 'px',
        backgroundPositionX: -this.bgXY[p].x + 'px',
        backgroundPositionY: -this.bgXY[p].y + 'px',
        transform: `scaleX(${this.dirx})`
      })
    }
    this.anim = this.rootElem.animate(kframes, {
      duration: 100*(this.phases.length - 1),
      easing: `steps(${this.phases.length - 1}, end)`,
      endDelay: 100,
      fill: 'forwards'
    });
    await this.anim.finished;
  } while (this.loop);
    this.anim.commitStyles();
    this.anim.cancel();
  }//}}}
  stop () {//{{{
    this.loop = false;
  }//}}}
  flip () {//{{{
  }//}}}
}


