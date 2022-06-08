const $e = (elName, cl, parEl) => {
  let e = document.createElement (elName);
  if (cl) e.classList.add (cl);
  if (parEl) parEl.appendChild (e);
  return e;
}

const socket = io();


class Recorder {
  constructor (x, y, w, h) {
    let el, ro = this.root = $e('div', 'Main', document.body);
    ro.style.left = x+'px';
    ro.style.top = y+'px';

    this.video = $e('video', 'Video', ro);
    this.video.width = w;
    this.video.height = h;
    this.video.poster = 'tux.jpg';
    this.video.addEventListener('ended', () => {
      this.video.src = this.video.poster;
    });

    this.dataBuf = [];
    this.stream = null;
    this.mRec = null;

    let nav = $e('div', 'Navig', ro);
    el = $e('div', 'Button', nav);
    el.innerHTML = 'Štart';
    this.runButton = el;
    el.addEventListener ('mouseup', e => {
      if (this.stream) this.stopStream(); else this.startStream();
    });

    el = $e('div', 'Button', nav);
    el.innerHTML = 'Ulož';
    el.addEventListener ('mouseup', e => {
      if (this.stream) this.stopStream();
      socket.emit('start');
      for (let d of this.dataBuf) {
        socket.emit('data', d);
      }
      socket.emit('stop');
    });
    
    el = $e('div', 'Button', nav);
    el.innerHTML = 'Načítaj';
    el.addEventListener ('mouseup', e => {
      if (this.stream) this.stopStream();
      this.video.src = 'video.webm?t=' + Date.now();
      this.video.play();
    });
  }

  async startStream () {//{{{
   try {
      this.stream = await window.navigator.mediaDevices.getUserMedia({
        audio:false, video: {width:160, height:120}
      });
   } catch (error) {
     console.log(error);
   }
    this.video.srcObject = this.stream;
    this.video.play();
    this.runButton.innerHTML = 'Stop';
    this.dataBuf = [];
    this.mRec = new MediaRecorder (this.stream, {mime: 'video/webm'});
    this.mRec.addEventListener('dataavailable', e => {
      if (e.data.size > 0) {
        this.dataBuf.push(e.data);
        //console.log('data=', e.data.size);
      }
    });
    this.mRec.start(100);
  }//}}}
  stopStream () {//{{{
    this.stream = null;
    this.video.pause();
    this.video.srcObject = null;
    this.runButton.innerHTML = 'Štart';
    this.mRec.stop();
    //this.dataBuf = [];
  }//}}}
}


document.addEventListener ('DOMContentLoaded', () => {
   new Recorder (20, 40, 300, 200);
});

