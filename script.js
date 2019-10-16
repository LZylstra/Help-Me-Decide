const apiKeyMealDB = 1;
const apiKeyYelp = "ad10642a117f6a43eda80076a5e92fa6";
const searchURLMealDB = "https://www.themealdb.com/api/json/v1/1/filter.php"; //param c=Seafood
const searchURLYelp = "https://api.yelp.com/v3/businesses/search";
const categories = ["Beef", "Chicken", "Dessert", "Lamb", "Miscellaneous", "Pasta", "Pork", "Seafood", "Side", "Starter", "Vegan", "Vegetarian", "Breakfast", "Goat"];


function getMeal(btn){
    //user has chosen to eat out
    $('.start').css("display", "none");
    if (btn === "out"){
        eatOut();
    }
    if (btn === "home"){
        eatIn();
    }
}

function eatOut(){
    //type of food text field

    //location text field

    //open now check box

    //random button

    //search button
}

function eatIn(){
    let categoryString;

    for (let i = 0; i < categories.length; i++){
        categoryString += `<option value = "${categories[i]}">${categories[i]}</option>`
    }

    //drop down list of categories
    $('#categories').append(categoryString);
    
    $('#left-box').append(
    `<input type = "submit" value = "Random" id = "random">
    <input type = "submit" value = "Search" id = "search">
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

$(watchForm);