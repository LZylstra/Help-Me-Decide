const APIID = "1e922488";
const apikeyRecipe = "6dc79f0942a7ef71e2b035618600378e";
const apiKeyYelp = "MzC-vR8dGg4sB93woVcMeZoy_2-6iX1EQv9bCUev0uQJRuIbRuO-1K6R4JmaAiSv8yLQZtFofBKQrLG1zrq80dFTVwKJ3Zfs44fmJM2sgoSXNYkeXO0-xIUS8kapXXYx";
const searchURLRecipe = "https://api.edamam.com/search"; 
const searchURLYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
const categories = ["Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian", "Breakfast", "Goat"];
let decision;

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function eatOut(){
    decision = "restaurant";
    $('#left-box').append(`
    <form class = "eat-form">
        <label for = "food-type" class = "eat-out">Type of Food: </label>
        <input type = "text" name = "food-type" class = "eat-out" id = "food-type-chosen">

        <label for = "location" class = "eat-out">Location: </label>
        <input type = "text" name = "location" class = "eat-out" id = "location-chosen">

        <label for = "radius" class = "eat-out">Search Radius: </label>
        <input type = "text" name = "radius" class = "eat-out" id = "search-radius">

        <label for = "open-now" class = "eat-out">Only show currently open restaurants </label>
        <input type = "checkbox" name = "open-now" class = "eat-out" id = "onlyopen">

        <button class = "eat-out random hidden button">Random </button>
        <button class = "eat-out search button">Search </button>
    </form>
    `);
}

function eatIn(){
    decision = "cook";
    let categoryString;
    /*
    for (let i = 0; i < categories.length; i++){
        categoryString += `<option value = "${categories[i]}">${categories[i]}</option>`
    }
    $('#categories').append(categoryString);
    */

    $('#left-box').append(
    `<form class = "eat-form">
        <label for = "food-search" class = "eat-out">Type of Food: </label>
        <input type = "text" name = "food-search" class = "eat-out" id = "food-search-chosen">
        <button class = "eat-in random hidden button">Random </button>
        <button class = "eat-in search button">Search </button>
    </form>
    `);
    //$('#categories').removeClass('hidden');
}
function getList(arr){
let returnString = "";
    for (let i = 0; i < arr.length; i++){
        returnString += `<li>${arr[i]}</li>`;
    }
    return returnString;
}

function displayResults(responseJson){
    console.log(responseJson)
    if (decision === "cook"){
        if (responseJson.hits.length === 0){
            $('#cookResults').append(`No Results found. Try a different search term (Example: keto breakfast)`);
        }
        //limit to 5 results
        for (let i = 0; i < responseJson.hits.length & i<5; i++){
            let cal = responseJson.hits[i].recipe.calories.toFixed(2);
            let ingredients = getList(responseJson.hits[i].recipe.ingredientLines);
            $('#cookResults').append(`
                <li><img src = "${responseJson.hits[i].recipe.image}" alt = "meal picture" width="50" height="50">
                    <h3>${responseJson.hits[i].recipe.label}</h3>
                    <h4>Calories: ${cal}</h4>
                    <h4>Total Time: ${responseJson.hits[i].recipe.totalTime} minutes</h4>
                    <p>Allergy Information:</p> <ul id = "cautions">${getList(responseJson.hits[i].recipe.cautions)}</ul>
                    <p>Ingredients Needed: </p><ul>${ingredients}</ul>
                    <a href = "${responseJson.hits[i].recipe.url}">Link to see full recipe </a>
                </li>
            `);
        }
    }

    if (decision === "restaurant"){
        if (responseJson.total === 0){
            $('#restaurantResults').append(`No Results found. Try broadening your search radius.`);
        }

        for (let i = 0; i < responseJson.businesses.length & i<5; i++){
           $('#restaurantResults').append(`
                <li><img src = "${responseJson.businesses[i].image_url}" alt = "restaurant picture" width="50" height="50">
                <h3>${responseJson.businesses[i].name}</h3>
                <h4>Price ${responseJson.businesses[i].price}</h4>
                <h4>Rating ${responseJson.businesses[i].rating}</h4>
                <p>${responseJson.businesses[i].location.display_address}</p>
                <p>${responseJson.businesses[i].display_phone}</p>
                <a href = "${responseJson.businesses[i].url}">Link to see more information</a></li>
            `);
        }
    }
}

function getRestaurants(foodTypeChoice, locationChoice, opennow, searchRadius){
    const params = {
        term: foodTypeChoice,
        location: locationChoice,
        open_now: opennow,
        radius: searchRadius
    }
    const queryString = $.param(params);
    let url = searchURLYelp + '?' + queryString;
    console.log(url);
    
    fetch(url, {headers: {
        "accept": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "Access-Control-Allow-Origin":"*",
        "Authorization": `Bearer ${apiKeyYelp}`}})
    .then(response =>{
        if (response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function getRecipes(foodTypeChoice){
    const params = {
        app_id: APIID,
        app_key: apikeyRecipe,
        q: foodTypeChoice
    }
    const queryString = $.param(params);
    let url = searchURLRecipe + "?" + queryString;

    console.log(url);

fetch(url)
    .then(response =>{
        if (response.ok){
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err =>{
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm(){
    let locationChoice;
    let foodTypeChoice;
    let opennow;
    $('#options').on("click", "#home-btn", function(event){
        event.preventDefault();
        $('.start').addClass('hidden');
        eatIn();
    });

    $('#options').on("click", "#out-btn", function(event){
        event.preventDefault();
        $('.start').addClass('hidden');
        eatOut();
    });

    $('#left-box').on( "click", ".random", function(event){
        event.preventDefault();
        console.log("random pressed");
    });

    $('#left-box').on( "click", ".search", function(event){
        event.preventDefault();
        $('#cookResults').empty();
        $('#restaurantResults').empty();
        // $('#right-box').removeClass('out-img').addClass('no-img');
        if (decision === "cook"){
            foodTypeChoice = $('#food-search-chosen').val();
           // console.log(foodTypeChoice);
           getRecipes(foodTypeChoice);
        }
        if (decision === "restaurant"){
            foodTypeChoice = $('#food-type-chosen').val();
           // console.log(foodTypeChoice);
            locationChoice = $('#location-chosen').val();
           // console.log(locationChoice);
            radius = $('#search-radius').val();
            opennow = $("#onlyopen")[0].checked;
            //console.log(opennow);
            getRestaurants(foodTypeChoice, locationChoice, opennow, radius);
        }
    });
    watchHeader();
}

function watchHeader(){
    $('#banner').on('click', '.reset-to-home', function(event){
        event.preventDefault();
        $('.start').removeClass('hidden');
        $('#categories').addClass('hidden');
        $('#categories').empty();
        $('.eat-out').css("display", "none");
        $('.eat-in').css("display", "none");
        $('#cookResults').empty();
        $('#restaurantResults').empty();
    })
}

$(watchForm);
