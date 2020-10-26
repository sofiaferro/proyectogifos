
//variables del tema
const dayTheme = document.getElementById('day-theme');
const nightTheme = document.getElementById('night-theme');
const themeChange = document.getElementById('themeChange');
const theme = localStorage.getItem('theme');
const favicon = localStorage.getItem('favicon');
const faviconImg = document.querySelector('.favicon');
const logo = localStorage.getItem('logo');
const logoImg = document.querySelector('.logo');

//libreria de gifs
const barraGifLibrary = document.getElementById('gifLibrary');
const gifContainer = document.getElementById('mis-gifs');

var gifLibrary = localStorage.getItem('gifLibrary');

//ventanas 
const ventanaCrearGif = document.getElementById('ventana-crear-gif');
const ventanaCaptura = document.getElementById('ventana-captura');
//titulos de ventanas
const tituloChequeo = document.getElementById('titulo-chequeo');
const tituloCaptura = document.getElementById('titulo-captura');
const tituloVistaPrevia = document.getElementById('titulo-vista-previa');

//botones ventana crear gif
const botonCrearGif = document.getElementById('crearGif');
//botones ventana chequeo previo
const contenedorChequeo = document.getElementById('contenedor-chequeo');
const botonesChequeo = document.getElementById('botones-chequeo');
//ventana subiendo gif
const ventanaSubiendoGif = document.getElementById('subiendo-gif');

//ventana gif subido
const ventanaGifExito = document.getElementById('gif-exito');

//botones ventana capturar
const contenedorCaptura = document.getElementById('contenedor-captura');
const botonesCaptura = document.getElementById('botones-captura');
//botones ventana repetir/guardar
const contenedorVistaPrevia = document.getElementById('contenedor-vista-previa');
const botonRepetirCaptura = document.getElementById('repetirCaptura');
const botonGuardarGif = document.getElementById('guardarGif');
//botones ventana descargar gif
const botonCopiarEnlace = document.getElementById('copiar-enlace');
const botonDescargarGif = document.getElementById('descargar-gif');

// instancia del recorder
var recorder = null;

//gif preview
var gifPreview = document.getElementById('preview');
var gif = document.getElementById('captura-gif');
var gifSubido = document.getElementById('gif-subido');

const initTheme = () => {
    window.localStorage.getItem('theme');
    window.localStorage.getItem('favicon');

    if (theme) {
        themeChange.href = theme;
    } else {
        themeChange.href = 'style-day.css';
    }
    if (logo) {
        logoImg.src = logo;
    } else {
        logoImg.src = '/img/gifOF_logo.png';
    }
    if (favicon) {
        faviconImg.href = favicon;
    } else {
        faviconImg.href = '/img/gifOF_logo.png';
    }

};

const initRecording = () => {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    }).then((mediaStream) => {
        gif.style.display = 'block';
        recorder = RecordRTC(mediaStream, {
            type: 'gif',
            canvas: {
                width: 320,
                height: 240
            },
            frameRate: 1,
            quality: 10,
        });
        botonesChequeo.onclick = guardarGif;
        gif.srcObject = mediaStream;
        gif.play();

    }).catch((error) => {
        console.error(error);
        alert('¡Oops! Algo salió mal... volvé a intentarlo');
    });
};

const guardarGif = () => {
    //cambio de ventana 
    tituloChequeo.style.display = 'none';
    tituloCaptura.style.display = 'block';
    contenedorChequeo.style.display = 'none';
    contenedorCaptura.style.display = 'flex';
    botonesCaptura.style.display = 'flex';
    //empieza a grabar
    recorder.startRecording();
    //inicio de reloj
    var clock = document.getElementsByClassName('clock')[0],
        seconds = 0, minutes = 0, hours = 0, t;

    function add() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        clock.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

        timer();
    }

    function timer() {
        t = setTimeout(add, 1000);
    }

    timer();

    botonesCaptura.onclick = () => {
        gif.style.display = 'none';
        gifPreview.style.display = 'block'
        recorder.stopRecording();
        contenedorCaptura.style.display = 'none';
        contenedorVistaPrevia.style.display = 'flex';
        var gifDuration = document.getElementById('clock');
        gifDuration.innerText = clock.textContent
        recorder.getBlob();
        recorder.getDataURL((url) => {
            gifPreview.src = url;
        })
        clearTimeout(t);

    };
};

const initBar = () => {
    var i = 0;
    function move() {
        if (i == 0) {
            i = 1;
            var elem = document.getElementById("myBar");
            var width = 1;
            var id = setInterval(frame, 30);
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                    i = 0;
                    const mensajeOk = document.getElementById('tiempo-restante')
                    mensajeOk.textContent = '¡Listo!';
                    mensajeOk.style.color = 'green';
                    ventanaSubiendoGif.style.display = 'none';
                    ventanaGifExito.style.display = 'block';
                } else {
                    width++;
                    elem.style.width = width + "%";
                    elem.innerHTML = width + "%";
                }
            }
        }
    }
    move();

};

const subirGif = () => {
    blob = recorder.getBlob();
    form = new FormData();
    form.append("file", blob, "gifnuevo.gif");
    fetch("https://upload.giphy.com/v1/gifs?api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl",
        {
            method: "POST",
            body: form
        }).then((res) => {
            return res.json();
        }).then((res) => {
            gifId = res.data.id;
            saveInLocalStorage(res);
            return getLink(gifId);
        });
    gifSubido.src = gifPreview.src;
    botonDescargarGif.onclick = () => {
        invokeSaveAsDialog(blob, "gifnuevo.gif");
    };

};

const saveInLocalStorage = (res) => {
    try {
        var localGifs = [];
        if (gifLibrary) {
            localGifs = localStorage.getItem('gifLibrary', JSON.parse(gifLibrary));
            localGifs.push(res);
            localStorage.setItem('gifLibrary', JSON.stringify(localGifs));
        } else {
            localGifs.push(res);
            localStorage.setItem('gifLibrary', JSON.stringify(localGifs));
        }
    } catch (error) {
        console.error(error);
    };

};

const initGifLibrary = async () => {
    try {
        if (gifLibrary) {
            var gifsIds = [];
            var misGifs = [];
            gifsIds = await JSON.parse(localStorage.getItem('gifLibrary'));
            gifsIds.forEach((item) => {
                let id = item.data.id
                fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl`)
                    .then((res) => {
                        return res.json();
                    }).then((res) => {
                        let newGif = document.createElement('IMG');
                        newGif.setAttribute('src', res.data.images.fixed_height.url);
                        newGif.setAttribute('class', 'contenedor-busqueda gif-small');
                        gifContainer.appendChild(newGif);
                    });
            });
            barraGifLibrary.style.display = 'flex';
        }
    } catch (error) {
        console.error(error);
    } finally {
        return misGifs;
    };
};

const getLink = async (id) => {
    fetch(`https://api.giphy.com/v1/gifs/${id}?api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl`)
        .then((res) => {
            return res.json();
        }).then((res) => {
            let url = res.data.url
            //inicio botón para copiar el enlace
            botonCopiarEnlace.onclick = () => {
                var copyUrl = document.createElement("input");
                document.body.appendChild(copyUrl);
                copyUrl.setAttribute("id", "copyUrlId");
                document.getElementById("copyUrlId").value = url;
                copyUrl.select();
                document.execCommand("copy");
                document.body.removeChild(copyUrl);
                return alert('¡Link copiado al portapapeles!');
            };
        });
}

initTheme();
initGifLibrary();

botonCrearGif.onclick = () => {
    ventanaCrearGif.style.display = 'none';
    ventanaCaptura.style.display = 'block';
    initRecording();
};

botonRepetirCaptura.onclick = () => {
    contenedorVistaPrevia.style.display = 'none';
    contenedorCaptura.style.display = 'block';
    gifPreview.style.display = 'none';
    gif.style.display = 'block';
    recorder.reset();
    guardarGif();
};

botonGuardarGif.onclick = () => {
    ventanaCaptura.style.display = 'none';
    ventanaSubiendoGif.style.display = 'block';
    initBar();
    subirGif();
};
