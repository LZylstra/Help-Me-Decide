const APIID = "1e922488";
const apikeyRecipe = "6dc79f0942a7ef71e2b035618600378e";
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
    <form class = "eat-form" id = "restaurant-options-box">
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

/* Displays the cook at home options */
function eatIn(){
    decision = "cook";
    let categoryString;

    $('#left-box').append(
    `<form class = "eat-form">
        <label for = "food-search" class = "eat-in">Type of Food: </label>
        <input type = "text" name = "food-search" class = "eat-in" id = "food-search-chosen">
        <button class = "eat-in random hidden button">Random </button>
        <button class = "eat-in search button">Search </button>
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
    console.log(responseJson)
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
                <li class = "result-item"><img src = "${responseJson.hits[i].recipe.image}" alt = "meal picture">
                    <h3>${responseJson.hits[i].recipe.label}</h3>
                    <h4 class = "line">Calories:</h4><p> ${cal}</p>
                    <h4 class = "line">Total Time:</h4><p> ${responseJson.hits[i].recipe.totalTime} minutes</p>
                    <h4>Allergy Information:</h4> <ul id = "cautions">${getList(responseJson.hits[i].recipe.cautions)}</ul>
                    <h4>Ingredients Needed: </h4><ul id = "ingredients">${ingredients}</ul>
                    <a href = "${responseJson.hits[i].recipe.url}" target="_blank" id = "link">Link to see full recipe </a>
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

/* EDAMAM API call and set up */
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
        console.log("random pressed");
    });

    /* Listens for when user has submitted form and gets and processes input */
    $('#left-box').on( "click", ".search", function(event){
        event.preventDefault();
        /* Remove previous results if user has already searched */
        $('#cookResults').empty();
        $('#restaurantResults').empty();

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
        $('#right-box').addClass('out-img');
        $('#left-box').removeClass('out-img').addClass('home-img');
    })
}

$(watchForm);
