const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('submit');
const autocompleteContainer = document.getElementById('autocompleteTerms');
const searchTerm = document.getElementById('search-results');
const menuContainer = document.getElementById('menu-desplegable');
const themeMenu = document.getElementById('desplegable');
const dayTheme = document.getElementById('day-theme');
const nightTheme = document.getElementById('night-theme');
const themeChange = document.getElementById('themeChange');
const theme = localStorage.getItem('theme');
const logo = localStorage.getItem('logo');
const favicon = localStorage.getItem('favicon');
const logoImg = document.querySelector('.logo');
const faviconImg = document.querySelector('.favicon');
const lupa = localStorage.getItem('lupa');
const lupaImg = document.querySelector('.boton-lupa');

const init = () => {
    //iniciación del cambio de tema sailor day/sailor night
    themeInit();
    //imprimo los más buscados y las tendencias
    getSuggestions(getSuggestedGifs);
    getTrending(printTrendingGifs);
    initGifLibrary();
    //inicialización de la barra de búsqueda
    searchInit();
};

const initGifLibrary = () => {
    let gifLibrary = localStorage.getItem('gifLibrary');
    let botonMisGifs = document.getElementById('misgifs');
    if (gifLibrary == null) {
        botonMisGifs.addEventListener('click', () => {
            alert('¡Todavía no subiste ningún gif!');
        });
    } else {
        botonMisGifs.setAttribute('href', 'mis-gifs.html');
    }
}

//iniciación y cambio de tema
const themeInit = () => {
    //chequear si hay preferencias en local storage
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
    //iniciar menu de cambio de tema
    menuContainer.addEventListener('click', () => {
        if (themeMenu.style.display === 'none') {
            themeMenu.style.display = 'block';
        } else {
            themeMenu.style.display = 'none';
        }

    });

    dayTheme.addEventListener('click', () => {
        themeMenu.style.display = 'none'
        logoImg.setAttribute('src', "/img/gifOF_logo.png");
        faviconImg.setAttribute('href', "/img/gifOF_logo.png");
        themeChange.setAttribute('href', 'style-day.css');
        localStorage.setItem('theme', 'style-day.css');
        localStorage.setItem('logo', '/img/gifOF_logo.png');
        localStorage.setItem('favicon', '/img/gifOF_logo.png');
    });
    nightTheme.addEventListener('click', () => {
        themeMenu.style.display = 'none'
        logoImg.setAttribute('src', "/img/gifOF_logo_dark.png");
        faviconImg.setAttribute('href', "/img/gifOF_logo_dark.png");
        themeChange.setAttribute('href', 'style-night.css');
        localStorage.setItem('theme', 'style-night.css');
        localStorage.setItem('logo', '/img/gifOF_logo_dark.png');
        localStorage.setItem('favicon', '/img/gifOF_logo_dark.png');
    });
};

//sección de búsqueda
//iniciación de barra de búsqueda
const searchInit = () => {
    searchButton.addEventListener('click', () => {
        if (searchBar.value) {
            if (themeChange.href.includes('style-day.css')) {
                lupaImg.setAttribute('src', '/img/lupa.svg');
            } else {
                lupaImg.setAttribute('src', 'img/lupa_light.svg');
            }
            searchButton.setAttribute("class", "boton-buscar-active");
            getSearchResults(searchBar.value, 10, printSearchResults);
            getHashtags(searchBar.value, printHashtags);
            autocompleteContainer.style.display = "none"
        } else {
            alert("Oops, parece que no ingresaste un valor válido");
        }
    });
    //inicialización de la barra de búsqueda
    searchBar.addEventListener('keydown', (e) => {
        searchButton.setAttribute("class", "boton-buscar-input");
        autocompleteContainer.style.display = 'inline-block';
        getAutocomplete(searchBar.value, printAutocomplete);
        if (e.key === 'Enter' && searchBar.value) {
            autocompleteContainer.style.display = "none";
            searchButton.setAttribute("class", "boton-buscar-active");
            getSearchResults(searchBar.value, 10, printSearchResults);
            getHashtags(searchBar.value, printHashtags);
        } else if (e.key === 'Enter' && !searchBar.value) {
            searchButton.setAttribute("class", "boton-buscar");
            alert("Oops, parece que no ingresaste un valor válido");
        }
        if (e.key === 'Backspace' || e.key === 'Delete' && searchBar.value) {
            clearSearch();
            searchButton.setAttribute("class", "boton-buscar");
        } else if (e.key === 'Backspace' || e.key === 'Delete' && !searchBar.value) {
            searchButton.setAttribute("class", "boton-buscar");
            alert("Oops, parece que no ingresaste un valor válido");
        }
    });

};

const getSearchResults = async (input, limit, callback) => {
    let result = null
    await fetch(`https://api.giphy.com/v1/gifs/search?api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl&q=${input}&limit=${limit}`) //OK
        .then((res) => res.json())
        .then((res) => {
            if (!!callback) {
                result = callback(res);
            } else {
                result = res;
            }
        })
        .catch((error) => console.log(error));

    return result
};

const printSearchResults = async (input) => {
    try {
        let gif = await document.querySelectorAll('.contenedor-busqueda');
        let gifCointainer = document.getElementById('gifs');
        gifCointainer.style.display = "flex";
        for (i = 0; i <= gif.length; i++) {
            for (i = 0; i <= 10; i++) {
                gif[i].setAttribute("alt", `${input.data[i].title}`);
                gif[i].setAttribute("src", `${input.data[i].images.fixed_height.url}`);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        return console.log('search ok');
    }
};

const clearSearch = () => {
    if (searchBar.value) {
        searchBar.value = "";
        autocompleteContainer.style.display = 'none';
    }
};

//autocomplete endpoint para las sugerencias de la barra de búsqueda

const getAutocomplete = async (input, callback) => {
    await fetch(`https://api.giphy.com/v1/gifs/search/tags?api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl&q=${input}&limit=3`)
        .then((res) => res.json())
        .then((res) => callback(res))
        .catch((error) => console.error(error));
};

const printAutocomplete = async (input) => {
    try {
        if (searchBar.value) {
            let terms = document.getElementsByClassName('autocomplete-term');
            for (let i = 0; i <= terms.length; i++) {
                let newSearch = input.data[i].name;
                terms[i].innerText = `${newSearch}`;
                terms[i].addEventListener('click', () => {
                    searchBar.value = newSearch;
                    searchTerm.value = newSearch;
                    getSearchResults(newSearch, 10, printSearchResults);
                    getHashtags(newSearch, printHashtags);
                    autocompleteContainer.style.display = 'none';
                })
            }
        }
    } finally {
        return 'autocomplete ok';
    }
};

//tags endpoint para los hashtags de la barra de búsqueda

const getHashtags = async (input, callback) => {
    await fetch(`https://api.giphy.com/v1/tags/related/${input}?&api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl`)
        .then((res) => res.json())
        .then((res) => callback(res))
        .catch((error) => console.log(error));
};

const printHashtags = (input) => {
    try {
        let hashtagContainer = document.getElementById('tags');
        hashtagContainer.style.display = "flex";
        let hashtags = document.getElementsByClassName('tag');
        let results = document.getElementById('search-result-container');
        results.style.display = "flex";
        searchTerm.setAttribute("value", searchBar.value);
        for (let i = 0; i <= hashtags.length; i++) {
            let ht = input.data[i].name.split(' ').join('');
            hashtags[i].innerText = `#${ht}`;
            hashtags[i].addEventListener('click', () => {
                searchBar.value = input.data[i].name;
                searchTerm.value = input.data[i].name;
                getSearchResults(input.data[i].name, 10, printSearchResults);
                getHashtags(input.data[i].name, printHashtags);
            })
        }
    } finally {
        return 'hashtags ok';
    }
};

//sección los más buscados
//tomo las búsquedas que son tendencia con el endpoint de trending searches
const getSuggestions = async (callback) => {
    await fetch('https://api.giphy.com/v1/trending/searches?&api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl')
        .then((res) => res.json())
        .then((res) => callback(res))
        .catch((error) => console.log(error));
};

//uso esos términos para hacer una nueva búsqueda que me devuelva un .gif para ese término 
const getSuggestedGifs = async (input) => {
    try {
        let results = [];
        for (let i = 0; i <= 3; i++) {
            let term = input.data[i];
            let result = await getSearchResults(term, 1);
            //armo un objeto más sintético con los dos resultados
            let singleResult = {
                name: term,
                image: result.data[0].images.original.url
            };
            results.push(singleResult);
        }
        printSuggestedGifs(results);
    } catch (error) {
        console.error(error);
    } finally {
        return "suggestions ok";
    }
};

//imprimo los resultados
const printSuggestedGifs = async (input) => {
    try {
        let trendGifs = document.getElementById('suggestions');
        for (let i = 0; i <= 3; i++) {
            let ht = input[i].name.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); }).split(' ').join('');
            let gifCointainer = document.createElement('DIV')
            gifCointainer.setAttribute("class", "contenedor-gif")
            gifCointainer.innerHTML = `<div class="contenedor-titulo">
                <p class="titulo">#${ht}</p>
                <img class="boton-cruz" src="/img/button3.svg" alt="Botón de cruz">
                </div>
                <div class="contenedor-imagenes">
                <img class="imagen-sugerencias" src="${input[i].image}" alt="Gif sugerido">
                <a class="vermas">Ver más...</a>
                </div>`
            trendGifs.appendChild(gifCointainer)
            let vermas = document.getElementsByClassName('vermas');
            vermas[i].addEventListener('click', () => {
                searchBar.value = input[i].name.toLowerCase();
                searchTerm.value = input[i].name.toLowerCase();
                getSearchResults(input[i].name, 10, printSearchResults);
                getHashtags(input[i].name, printHashtags);
                autocompleteContainer.style.display = 'none';
            })
        }
    } catch (error) {
        console.error(error);
    } finally {
        return "print ok";
    };
};

//sección tendencias
//trending endpoint
const getTrending = async (callback) => {
    await fetch('https://api.giphy.com/v1/gifs/trending?&api_key=8P0dxSdsNdlXKGRkQQDjgsayd8HPPfCl')
        .then((res) => res.json())
        .then((res) => callback(res))
        .catch((error) => console.log(error));
};

const printTrendingGifs = async (input) => {
    try {
        let TrendingGifs = await document.querySelectorAll('.contenedor-tendencias');
        for (i = 0; i <= TrendingGifs.length; i++) {
            for (i = 0; i <= 10; i++) {
                TrendingGifs[i].setAttribute("alt", `${input.data[i].title}`);
                TrendingGifs[i].setAttribute("src", `${input.data[i].images.fixed_height.url}`);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        return 'search ok';
    }
};

//iniciar
init();