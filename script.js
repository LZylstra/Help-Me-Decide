const apiKeyMealDB = 1;
const apiKeyYelp = "MzC-vR8dGg4sB93woVcMeZoy_2-6iX1EQv9bCUev0uQJRuIbRuO-1K6R4JmaAiSv8yLQZtFofBKQrLG1zrq80dFTVwKJ3Zfs44fmJM2sgoSXNYkeXO0-xIUS8kapXXYx";
const searchURLMealDB = "https://www.themealdb.com/api/json/v1/1/filter.php"; 
const searchURLYelp = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
const categories = ["Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian", "Breakfast", "Goat"];
let decision;

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }

function eatOut(){
    decision = "resturant";
    $('#left-box').append(`
    <form class = "eat-form">
        <label for = "food-type" class = "eat-out">Type of Food: </label>
        <input type = "text" name = "food-type" class = "eat-out" id = "food-type-chosen">

        <label for = "location" class = "eat-out">Location: </label>
        <input type = "text" name = "location" class = "eat-out" id = "location-chosen">

        <label for = "open-now" class = "eat-out">Only show currently open resturants </label>
        <input type = "checkbox" name = "open-now" class = "eat-out" id = "onlyopen">

        <button class = "eat-out random hidden">Random </button>
        <button class = "eat-out search">Search </button>
    </form>
    `);
}

function eatIn(){
    decision = "cook";
    let categoryString;

    for (let i = 0; i < categories.length; i++){
        categoryString += `<option value = "${categories[i]}">${categories[i]}</option>`
    }

    $('#categories').append(categoryString);
    
    $('#left-box').append(
    `<form class = "eat-form">
        <button class = "eat-in random hidden">Random </button>
        <button class = "eat-in search">Search </button>
    </form>
    `);
    $('#categories').removeClass('hidden');
}
/*
function getResults(foodTypeChoice, locationChoice, opennow){
    let url;
    if (decision === "cook"){
        url = searchURLMealDB + "?c=" + foodTypeChoice;
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
    if (decision === "resturant"){
        const params = {
            term: foodTypeChoice,
            location: locationChoice,
            open_now: opennow
        }
        const queryString = $.param(params);
        url = searchURLYelp + '?' + queryString;
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
}*/

function displayResults(responseJson){
    console.log(responseJson)
    if (decision === "cook"){
        //limit to 5 results
        for (let i = 0; i < responseJson.meals.length & i<5; i++){
            $('#cookResults').append(`
                    <li><img src = "${responseJson.meals[i].strMealThumb}" alt = "meal picture" width="50" height="50">
                    <h3>${responseJson.meals[i].strMeal}</h3></li>
                `);
        }
    }
    if (decision === "resturant"){
        for (let i = 0; i < responseJson.businesses.length & i<5; i++){
            $('#resturantResults').append(`
                <li><h3>${responseJson.businesses[i].name}</h3></li>
                <li><h4>Rating: ${responseJson.businesses[i].rating}</h4></li>
                <li><a href = "${responseJson.businesses[i].url}">Link to see more information</a></li>
            `);
        }
    }
}

function getResturants(foodTypeChoice, locationChoice, opennow){
        const params = {
            term: foodTypeChoice,
            location: locationChoice,
            open_now: opennow
        }
        const queryString = $.param(params);
        url = searchURLYelp + '?' + queryString;
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
    let url;
        url = searchURLMealDB + "?c=" + foodTypeChoice;
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
        $('.start').css("display", "none");
        eatIn();
    });

    $('#options').on("click", "#out-btn", function(event){
        event.preventDefault();
        $('.start').css("display", "none");
        eatOut();
    });

    $('#left-box').on( "click", ".random", function(event){
        event.preventDefault();
        console.log("random pressed");
    });

    $('#left-box').on( "click", ".search", function(event){
        event.preventDefault();
        $('#cookResults').empty();
        $('#resturantResults').empty();
        if (decision === "cook"){
            foodTypeChoice = $('#categories').val();
           // console.log(foodTypeChoice);
           getRecipes(foodTypeChoice);
        }
        if (decision === "resturant"){
            foodTypeChoice = $('#food-type-chosen').val();
           // console.log(foodTypeChoice);
            locationChoice = $('#location-chosen').val();
           // console.log(locationChoice);
            opennow = $("#onlyopen")[0].checked;
            //console.log(opennow);
            getResturants(foodTypeChoice, locationChoice, opennow);
        }
    });
    watchHeader();
}

function watchHeader(){
    $('#banner').on('click', '.reset-to-home', function(event){
        event.preventDefault();
        $('.start').css("display", "inline-block");
        $('#categories').addClass('hidden');
        $('#categories').empty();
        $('.eat-out').css("display", "none");
        $('.eat-in').css("display", "none");
        $('#cookResults').empty();
        $('#resturantResults').empty();
    })
}

$(watchForm);
