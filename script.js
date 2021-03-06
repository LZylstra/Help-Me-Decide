const APIID = "aa801996";
const apikeyRecipe = "f31249b063e0a9a17be0f79c3636034e";
const apiKeyYelp = "MzC-vR8dGg4sB93woVcMeZoy_2-6iX1EQv9bCUev0uQJRuIbRuO-1K6R4JmaAiSv8yLQZtFofBKQrLG1zrq80dFTVwKJ3Zfs44fmJM2sgoSXNYkeXO0-xIUS8kapXXYx";
const searchURLRecipe = "https://api.edamam.com/search"; 
const searchURLYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
let decision;

/* Helper function to format the parameters for the url */
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

  /* Displays the restaurant options */
function eatOut(){
    decision = "restaurant";
    $('#left-box').append(`
    <form class = "eat-form outline" id = "restaurant-options-box">
        <label for = "food-type-chosen" class = "eat-out block">Type of Food: </label>
        <input type = "text" name = "food-type" class = "eat-out" id = "food-type-chosen">

        <label for = "location-chosen" class = "eat-out block">Location: </label>
        <input type = "text" name = "location" class = "eat-out" id = "location-chosen" placeholder="city, state, address, zip, etc." required>

        <label for = "search-radius" class = "eat-out block">Search Radius: </label>
        <input type = "number" name = "radius" class = "eat-out block" id = "search-radius" placeholder="distance in meters">

        <label for = "onlyopen" class = "eat-out" id = "check">Only show currently open restaurants </label>
        <input type = "checkbox" name = "open-now" class = "eat-out" id = "onlyopen">

        <button class = "eat-out search button" id ="search-btn">Search </button>
        <button class = "eat-out random hidden button">Random </button>

        <p class = "eat-out">Not sure where to start? Here's some suggestions for things to search for:</p>

        <ul class = "eat-in"><li>Meal type: Breakfast, Lunch, Dinner, Snack</li>
        <li>Health options: Low-Carb, Dairy Free, Keto, Kosher, etc.</li>
        <li>Cuisine Type: Desserts, Caribbean, Japanese, Soup, etc.</li>
        <li>Keywords: taco, burger, pancakes, etc.</li>
        <li>Or try a combination: Dairy free breakfast, Japanese snack, etc.</li>
        </ul>
    </form>
    `);
}

/* Displays the cook at home options */
function eatIn(){
    decision = "cook";
    let categoryString;

    $('#left-box').append(
    `<form class = "eat-form outline" id = "eat-form-in">
        <label for = "food-search-chosen" class = "eat-in">Type of Food: </label>
        <input type = "text" name = "food-search" class = "eat-in" id = "food-search-chosen">

        <button class = "eat-in search button">Search </button>
        <button class = "eat-in random hidden button">Random </button>

        <p class = "eat-in">Not sure where to start? Here's some suggestions for things to search for:</p>
        <ul class = "eat-in"><li>Meal type: Breakfast, Lunch, Dinner, Snack</li>
        <li>Health options: Low-Carb, Dairy Free, Keto, Kosher, etc.</li>
        <li>Cuisine Type: Desserts, Caribbean, Japanese, Soup, etc.</li>
        <li>Keywords: taco, burger, pancakes, etc.</li>
        <li>Or try a combination: Dairy free breakfast, Japanese snack, etc.</li>
        </ul>
    </form>
    `);
}

/* Helper function to turn an array into a separated html list */
function getList(arr){
let returnString = "";
    for (let i = 0; i < arr.length; i++){
        returnString += `<li>${arr[i]}</li>`;
    }
    return returnString;
}

/* Results display function */
function displayResults(responseJson){
    $('#results').removeClass('hidden');
    /* Display the cook at home results */
    if (decision === "cook"){
        /* If the API can't find any results, inform user */
        if (responseJson.hits.length === 0){
            $('#cookResults').append(`No Results found. Try a different search term (Example: keto breakfast)`);
        }
        /* Loop through the results, limiting it to 5 */
        for (let i = 0; i < responseJson.hits.length & i<5; i++){
            /* Adjust the calories result to only show two decimals  */
            let cal = responseJson.hits[i].recipe.calories.toFixed(2);
            /* Get the ingredients result in a HTML list format */
            let ingredients = getList(responseJson.hits[i].recipe.ingredientLines);
            /* Add results to the results section and the unordered list */
            $('#cookResults').append(`
                <li class = "result-item outline"><img src = "${responseJson.hits[i].recipe.image}" alt = "meal picture">
                    <div class = "breakthings">
                    <h3>${responseJson.hits[i].recipe.label}</h3>
                    <h4 class = "line">Calories:</h4><p> ${cal}</p>
                    <h4 class = "line">Total Time:</h4><p> ${responseJson.hits[i].recipe.totalTime} minutes</p>
                    <h4 class = "allergy">Allergy Information:</h4><ul id = "cautions">${getList(responseJson.hits[i].recipe.cautions)}</ul>
                    <h4>Ingredients Needed: </h4><ul id = "ingredients">${ingredients}</ul>
                    <a href = "${responseJson.hits[i].recipe.url}" target="_blank" class = "link">Link to see full recipe </a>
                    </div>
                </li>
            `);
        }
    }

    /* Display the restaurant results */
    if (decision === "restaurant"){
        /* If the API can't find any results, inform user */
        if (responseJson.total === 0){
            $('#restaurantResults').append(`No Results found. Try broadening your search radius.`);
        }
        /* Loop through the results, limiting it to 5 */
        for (let i = 0; i < responseJson.businesses.length & i<5; i++){
            /* Add results to the results section and the unordered list */
           $('#restaurantResults').append(`
                <li class = "result-item outline">
                    <img src = "${responseJson.businesses[i].image_url}" alt = "restaurant picture">
                <div id = "restaurant-div">
                    <h3>${responseJson.businesses[i].name}</h3>
                    <h4 class = "line">Price </h4><p id ="price"> ${responseJson.businesses[i].price}</p>
                    <h4 class = "line">Rating </h4><p> ${responseJson.businesses[i].rating}</p>
                    <p class = "text-line">${responseJson.businesses[i].location.display_address}</p>
                    <p class = "text-line">${responseJson.businesses[i].display_phone}</p>
                    <a href = "${responseJson.businesses[i].url}" target="_blank" class = "link">Link to see more information</a></li>
                </div>
            `);
        }
    }
}

/* Yelp API call and set up */
function getRestaurants(foodTypeChoice, locationChoice, opennow, searchRadius){
    const params = {
        term: foodTypeChoice,
        location: locationChoice,
        open_now: opennow,
        radius: searchRadius
    }
    const queryString = $.param(params);
    let url = searchURLYelp + '?' + queryString;
    
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

/* EDAMAM API call and set up */
function getRecipes(foodTypeChoice){
    const params = {
        app_id: APIID,
        app_key: apikeyRecipe,
        q: foodTypeChoice
    }
    const queryString = $.param(params);
    let url = searchURLRecipe + "?" + queryString;

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

/* Watch for buttons home-btn, out-btn, random, search */
function watchForm(){
    let locationChoice;
    let foodTypeChoice;
    let opennow;

    /* Listen for user cliking the cook at home button */
    $('#options').on("click", "#home-btn", function(event){
        event.preventDefault();
        /* Hide the starting view elements */
        $('.start').addClass('hidden');
        /* Adjust background image */
        $('#right-box').removeClass('out-img').addClass('no-img');
        eatIn();

    });

    /* Listen for user cliking the restaurant button */
    $('#options').on("click", "#out-btn", function(event){
        event.preventDefault();
        /* Hide the starting view elements */
        $('.start').addClass('hidden');
        /* Adjust background images */
        $('#right-box').removeClass('out-img').addClass('no-img');
        $('#left-box').removeClass('home-img').addClass('out-img');
        eatOut();
    });

    /* Gives the user random options depending on if they picked cook at home or restaurant */
    $('#left-box').on( "click", ".random", function(event){
        event.preventDefault();
    });

    /* Listens for when user has submitted form and gets and processes input */
    $('#left-box').on( "click", ".search", function(event){
        event.preventDefault();
        /* Remove previous results if user has already searched */
        $('#cookResults').empty();
        $('#restaurantResults').empty();
        $('#js-error-message').text('');

        if (decision === "cook"){
            foodTypeChoice = $('#food-search-chosen').val();
           getRecipes(foodTypeChoice);
        }

        if (decision === "restaurant"){
            foodTypeChoice = $('#food-type-chosen').val();
            locationChoice = $('#location-chosen').val();
            radius = $('#search-radius').val();
            opennow = $("#onlyopen")[0].checked;
            getRestaurants(foodTypeChoice, locationChoice, opennow, radius);
        }
    });
    /* Watch for the home or about buttons to be selected */
    watchHeader();
}

    /* Watch for the home or about buttons to be selected*/
function watchHeader(){
    /* Reset page to start view */
    $('#banner').on('click', '.reset-to-home', function(event){
        event.preventDefault();
        $('.start').removeClass('hidden');
        $('.eat-out').css("display", "none");
        $('.eat-in').css("display", "none");
        $('#cookResults').empty();
        $('#restaurantResults').empty();
        $('#restaurant-options-box').remove();
        $('eat-form-in').remove();
        $('#right-box').addClass('out-img');
        $('#left-box').removeClass('out-img').addClass('home-img');
    })
}

$(watchForm);
