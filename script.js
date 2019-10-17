const apiKeyMealDB = 1;
const apiKeyYelp = "ad10642a117f6a43eda80076a5e92fa6";
const searchURLMealDB = "https://www.themealdb.com/api/json/v1/1/filter.php"; //param c=Seafood
const searchURLYelp = "https://api.yelp.com/v3/businesses/search";
const categories = ["Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian", "Breakfast", "Goat"];


function getMeal(btn){
    $('.start').css("display", "none");
    if (btn === "out"){
        eatOut();
    }
    if (btn === "home"){
        eatIn();
    }
}

function eatOut(){
    $('#right-box').append(`
    <label for = "food-type" class = "eat-out">Type of Food: </label>
    <input type = "text" name = "food-type" class = "eat-out">

    <label for = "location" class = "eat-out">Location: </label>
    <input type = "text" name = "location" class = "eat-out">

    <label for = "open-now" class = "eat-out">Only show currently open resturants </label>
    <input type = "checkbox" name = "open-now" class = "eat-out">

    <input type = "submit" value = "Random" id = "random" class = "eat-out">
    <input type = "submit" value = "Search" id = "search" class = "eat-out">
    `);
}

function eatIn(){
    let categoryString;

    for (let i = 0; i < categories.length; i++){
        categoryString += `<option value = "${categories[i]}">${categories[i]}</option>`
    }

    $('#categories').append(categoryString);
    
    $('#left-box').append(
    `<input type = "submit" value = "Random" id = "random" class = "eat-in">
    <input type = "submit" value = "Search" id = "search" class = "eat-in">
    `);
    $('#categories').removeClass('hidden');
}

function watchForm(){
    $('form').submit(event => {
        event.preventDefault();
        var btn = document.activeElement.id;
        getMeal(btn);
    })
}

function watchHeader(){
    $('#banner').on('click', '.reset-to-home', function(event){
        event.preventDefault();
        $('.start').css("display", "inline-block");
        $('#categories').addClass('hidden');
        $('.eat-out').css("display", "none");
        $('.eat-in').css("display", "none");
    })
}

$(watchForm);
$(watchHeader)