const basePokeApi = 'https://pokeapi.co/api/v2/';
let data = {
    offset: Math.floor(Math.random() * 1050) + 1,
    limit: 4,
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
    const favColor = "text-secundary";
    const TeamColor = "text-secundary";
    let cardContent = `
    <div class="card">
    <img src="${cardImg}" class="card-img-top" alt="${pokemon.name}">
    <div class="card-body">
      <h5 class="card-title">${pokemon.name}</h5>
      <p class="card-text">${pokemon.description}</p>
    </div>
    <div class="card-footer d-flex justify-content-between">
      <button class="btn btn-light"><i class="fas fa-heart ${favColor}"></i></button>
      <button class="btn btn-light"><i class="fas fa-bookmark ${TeamColor}"></i></button>
    </div>
  </div>
    `;
    wrapper.innerHTML = cardContent;
    return wrapper;
}

/**
 * 
 * @param {array pokemon} list pokemons list
 * @param {DOMElement} target DOM Element
 */
const showListAsCard = (list, target) => {
    list.forEach(pokemon => {
        target.appendChild(createPokemonCard(pokemon));
    })
};

/**
 * 
 * @param {funtion} action //callback when it finish getting data
 */
const getDiscoveryPokemon = (action) => {
    const endPoint = basePokeApi + `pokemon?limit=${data.limit}=4&offset=${data.offset}`;

    fetch(endPoint).then(response => response.json()).then(data => {
        action(data);
    }).catch(err => {
        console.log('Error', err)
    })
}
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
/**
 * Settings all of nesesary to app work 
 */
const App = () => {
    console.log('Start App');
    getDiscoveryPokemon(discover => {
        data.discover = discover;
        showDiscover();
    })

}
window.onload = App;