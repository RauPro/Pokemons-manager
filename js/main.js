const basePokeApi = 'https://pokeapi.co/api/v2/';
let data = {
    offset: Math.floor(Math.random() * 1050) + 1,
    limit: 4,
    favs: [],
    team: [],
};

/**
 * Creates the structures HTML of a card to show
 * @param {object} pokemon It have the information about pokemon to show
 * Take into consideration if Pokemon is amoung favs or User's team
 */
const createPokemonCard = (pokemon) => {
    let wrapper = document.createElement('div');
    wrapper.classList.add('col', 'mb-4');
    const cardImg = pokemon.img || "img/default_thubmnail.png";
    const favColor = data.favs.findIndex((favPokemon) => pokemon.name == favPokemon.name) >= 0
      ? "text-danger"
      : "text-secondary";
    const teamColor = data.team.findIndex((teamPokemon) => pokemon.name == teamPokemon.name) >= 0
      ? "text-primary"
      : "text-secondary";  
    let cardContent = `
    <div class="card">
      <img src="${cardImg}" class="card-img-top" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <p class="card-text">${pokemon.description}</p>
      </div>
      <div class="card-footer d-flex">
        <button data-pokemon='${JSON.stringify(pokemon)}'
            type="button" class="btn btn-light mr-auto fav-pokemon ${
              pokemon.name
            }">
            <i class="fas fa-heart ${favColor} "></i>
        </button>
        <button data-pokemon='${JSON.stringify(pokemon)}'
          type="button" class="btn btn-light team-pokemon ${pokemon.name}">
          <i class="fas fa-bookmark ${teamColor}"></i>
        </button>
      </div>
    </div>`;
    wrapper.innerHTML = cardContent;
    return wrapper;
}

/**
 * 
 * @param {array pokemon} list pokemons list
 * @param {DOMElement} target DOM Element
 */
const showListAsCard = (list, target) => {
    target.innerHTML = '';
    list.forEach(pokemon => {
        target.appendChild(createPokemonCard(pokemon));
    })
};

/**
 * 
 * @param {funtion} action //callback when it finish getting data
 */
const getDiscoveryPokemon = (endPoint, action) => {

    fetch(endPoint).then(response => response.json()).then(data => {
        action(data);
    }).catch(err => {
        console.log('Error', err)
    })
}

/**
 * Creat the pokemon dataset
 * @param {API} data 
 */
const createPokemon = (data) => {
    return {
        name: data.name,
        img: data.sprites.front_default,
        description:
            "This pokemon has the type " +
            data.types.reduce((typesText, current) => {
                return (typesText == "" ? "" : typesText + ",") + current.type.name;
            }, ""),
    }
}

/**
 * Show pokemons
 */
const showDiscover = async () => {
    let pokemons = [];
    for (const pokemonMetaData of data.discover.results) {
        const response = await fetch(pokemonMetaData.url);
        const data = await response.json();
        let pokemon = createPokemon(data);
        pokemons.push(pokemon);
    }
    let dest = document.querySelector(".Discovery-result");
    console.log(pokemons)
    showListAsCard(pokemons, dest);
}


const saveDiscoverData = (discover) => {
    data.discover = discover;
    showDiscover();
}

/**
 * Next pagination
 */
const nextDiscoverEvent = () => {
    document.querySelector(".discovery-next").addEventListener('click', e => {
        e.preventDefault();
        getDiscoveryPokemon(data.discover.next, saveDiscoverData);
    })
}

/**
 * To back
 */
const previousDiscoverEvent = () => {
    document.querySelector(".discovery-previous").addEventListener('click', e => {
        e.preventDefault();
        getDiscoveryPokemon(data.discover.previous, saveDiscoverData);
    })
}
const listToggle = (target,list,after)=>{
    const pokemonToAddORemove=JSON.parse(target.dataset.pokemon);
    const index =list.findIndex(
        (pokemon)=>pokemon.name==pokemonToAddORemove.name
    );
    if(index>=0){
        list.splice(index,1);
    }else{
        list.push(pokemonToAddORemove)
    }
    if(after) after(pokemonToAddORemove);
        
}

const favListener = () => {
    document.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains("fav-pokemon")) {
            listToggle(target, data.favs, (pokemon) => {
                showListAsCard(data.favs,document.querySelector(".fav-result"));
            })
        }
    })
}
const teamListener = () => {
    document.addEventListener('click', e => {
        const target = e.target;
        if (target.classList.contains("team-pokemon")) {
            listToggle(target, data.teams, (pokemon) => {
                console.log("remonve", pokemon);
            })
        }
    })
}
const addListeners = () => {
    nextDiscoverEvent();
    previousDiscoverEvent();
    favListener();
  teamListener();
}
/**
 * Settings all of nesesary to app work 
 */
const App = () => {
    console.log('Start App');
    addListeners();
    const endPoint = basePokeApi + `pokemon?limit=${data.limit}=4&offset=${data.offset}`;

    getDiscoveryPokemon(endPoint, saveDiscoverData);

}
window.onload = App;