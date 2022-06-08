console.log('Začíname');

class Form {
    constructor(baseElem, btnElem) {
        this.root = baseElem;
        this.form = document.createElement('form');
        this.form.method = 'post';
        this.form.innerHTML = "Meno:<input type='text' name='name'/> <br> Priezvisko:<input type='text' name='surname'/><br><input type='submit' value='Posli'/>";
        btnElem.addEventListener('mousedown', e => {
            if (this.form.parentElement) this.hide();
            else this.show();
        });
    }
    show() {
        this.root.append(this.form);
    }
    hide() {
        this.form.remove();
    }
}

const $ = qs => document.querySelector(qs);

window.addEventListener('load', () => {
    new Form($('div.Main'), $('button.Button'));
});