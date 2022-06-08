const $e = (elName, cl, parEl) => {
  var e = document.createElement (elName);
  if (cl) e.classList.add (cl);
  if (parEl) parEl.appendChild (e);
  return e;
}


const socket = io();



class UserList {

  constructor (x, y, w=330, h=400) {
    let el, ro = this.root = $e('div', 'Main');
    ro.style.left = x+'px';
    ro.style.top = y+'px';
    ro.style.width = w+'px';
    ro.style.height = h+'px';

    $e('div', 'Headline', ro).innerHTML = 'Zoznam účastníkov';

    this.list = $e('div', 'List', ro);

    el = $e('button', 'Button', ro);
    el.innerHTML = 'Registruj sa';
    el.addEventListener ('mousedown', e => this.root.querySelector('.Formular').classList.toggle('Formular2'));
   
    el = $e('div', 'Formular', ro);
    $e('div', '', el).innerHTML = 'Meno:';
    this.input1 = $e('input', null, el);
    $e('div', '', el).innerHTML = 'Priezvisko:';
    this.input2 = $e('input', null, el);
    el = $e('button', 'sendButton', el);
    el.innerHTML = 'Posli';
    el.addEventListener ('mousedown', e => {
      this.root.querySelector('.Formular').classList.toggle('Formular2');
      this.send ();
      this.input1.value = this.input2.value = '';
    });
    document.body.appendChild (ro);



    // Sem doplnte
    socket.on('refresh', db => this.refresh(db));

    socket.emit('select', db => this.refresh(db));


  }


  send () {
    socket.emit('insert', {name:this.input1.value,  surname:this.input2.value});
  }


  refresh (db) {
    this.list.innerHTML = '';
    for(let row of db) {
      $e('div', 'Row', this.list).innerHTML = `${row.name} ${row.surname}`;
    }
  }

}




window.addEventListener ('load', () => {
  new UserList (20,50);
  new UserList (450,150);
});




