// Ingredients API Request
function searchIngredients(ingredient) {
    // Used a proxy to get rid of CORS error
    var proxy = "https://api.allorigins.win/get?url=";
    var ingredientsURL = proxy + encodeURIComponent("https://www.wholefoodsmarket.com/api/search?text=" + ingredient + "&store=10713&limit=60&offset=0");

    fetch(ingredientsURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (proxyData) {
            return JSON.parse(proxyData.contents);
        })
        .then(function (data) {
            var ingredientCard = document.querySelector("#ingredient-card");
            ingredientCard.innerHTML = "";

            document.querySelector("#ingredient-name").textContent = ingredient;
            // Loops through data results and grabs the data 
            for (i = 0; i < data.results.length; i++) {
                var price = data.results[i].regularPrice;
                var brand = data.results[i].brand;
                var name = data.results[i].name;
                var link = "https://www.wholefoodsmarket.com/product/" + data.results[i].slug;
                var image = data.results[i].imageThumbnail;

                // Ingredient Cards for Modal added to page here
                ingredientCard.innerHTML += `
                    <div class="col s6 m3 l2">
                       
                        <div class="card modal-card">
                            <a href="${link}" target="_blank" style="display:block; color:black">
                                <div class="card-image">
                                    <img src="${image}">
                                </div>
                                <div class="card-content">
                                    <p class="brand"><b>${brand}</b></p>
                                    <p class="name">${name}</p>
                                    <p>$<span class="price">${price}</span></p>
                                </div>
                            </a>
                            <div class="card-action center-align">
                                <i class="material-icons checkbox-outline">check_box_outline_blank</i>
                            </div>
                        </div>
                    </div> 
                    `;
            }

            // Shows message when ingredient isn't available
            if (data.results.length == 0) {
                ingredientCard.innerHTML = `
                <div class="center-align">
                <p><b>Sorry this ingredient is not available or sold out</b></p>
                <p><i>Please use the substitute search bar to find an alternative item</i></p>
                </div>
                `
            }
            else {
                // Adds default check to first ingredient card in modal
                var firstCard = ingredientCard.querySelector(".modal-card");
                firstCard.querySelector(".checkbox-outline").textContent = "check_box";
                firstCard.classList.add("checked");
            }
        })
}

// Grabs information for each ingredient and adds it to the final ingredients modal cards
function finalIngredients(chosenIngredients) {
    var chosenCards = document.querySelector("#chosen-ingredients");
    chosenCards.innerHTML = "";

    // Loops through array to get different info
    for (i = 0; i < chosenIngredients.length; i++) {
        var price = chosenIngredients[i].price;
        var brand = chosenIngredients[i].brand;
        var name = chosenIngredients[i].name;
        var link = chosenIngredients[i].link;
        var image = chosenIngredients[i].image;

        // Chosen Cards added to Modal
        chosenCards.innerHTML += `
        <div class="col s6 m3 l2">
        
            <div class="card modal-card checked">
                <a href="${link}" target="_blank" style="display:block; color:black">
                    <div class="card-image">
                        <img src="${image}">
                    </div>
                    <div class="card-content">
                        <p class="brand"><b>${brand}</b></p>
                        <p class="name">${name}</p>
                        <p class="price">${price}</p>
                    </div>
                </a>
                <div class="card-action center-align">
                    <i class="material-icons checkbox-outline">check_box</i>
                </div>
            </div>
        </div> 
        `;
    }
}

// --------------------------------------------------------------------------------------------
if (window.location.pathname.indexOf("/index.html") > -1 || window.location.pathname == "/Easy-Eats/") {
    // homepage advanced search modal
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });

    //home page search
    document.querySelector("#search-btn").addEventListener("click", function (e) {
        e.preventDefault();
        var homeSearch = document.querySelector("#search-input").value;
        if (homeSearch !== " ") {
            window.location.href = "search.html";
        };
    });

}

// --------------------------------------------------------------------------------------------
// -----------------------------------[LOAD RANDOM RECIPES]------------------------------------

if (window.location.pathname.indexOf("/index.html") > -1 || window.location.pathname.indexOf("/recipe.html") > -1) {
    // loads random recipe for popular recipes section
    var usedRecipes = [];
    function loadRandomRecipe(i) {
        var randomRecipeURL = "https://www.themealdb.com/api/json/v1/1/random.php?cache=" + i;

        fetch(randomRecipeURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {

                var popRecipeDiv = document.querySelector("#popular-recipes");
                var recipeId = data.meals[0].idMeal;
                var recipeName = data.meals[0].strMeal;
                var recipeImg = data.meals[0].strMealThumb;
                var recipeCategory = data.meals[0].strCategory;

                if (usedRecipes.includes(recipeId)) {
                    return loadRandomRecipe(i + 100);
                }
                usedRecipes.push(recipeId);

                popRecipeDiv.innerHTML += `
                <div class="col s12 m4 l2-5">
                    <div class="card">
                        <a href="./recipe.html?id=${recipeId}">
                            <div class="card-image">
                                <img src="${recipeImg}">
                                <a class="btn-floating halfway-fab waves-effect waves-light red">
                                    <i class="far fa-heart"></i>
                                </a>
                            </div>
                            <div class="card-content">
                                <span class="card-title">${recipeName}</span>
                                <p>${recipeCategory}</p>
                            </div>
                        </a>
                    </div>
                </div>
                `
            });
    }

    for (i = 0; i < 10; i++) {
        loadRandomRecipe(i);
    }
}

// --------------------------------------------------------------------------------------------
// ----------------------[GRABS DATA FROM RECIPES API FOR RECIPE PAGE]-------------------------

// Recipe API Request by Id
function loadRecipeByID(Id) {
    var recipeURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + Id

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var orderedInstructions = data.meals[0].strInstructions.split(".");
            var recipeName = document.querySelector("#recipe-name");
            var recipeCategory = document.querySelector("#recipe-category");
            var recipeImg = document.querySelector("#recipe-img");
            var recipeTags = document.querySelector("#recipe-tags");
            var ingredientList = document.querySelector("#ingredient-list");
            var recipeInstructions = document.querySelector("#recipe-instructions");
            var tutorialVideo = document.querySelector("#tutorial");
            ingredientList.innerHTML = "";

            recipeName.innerHTML = data.meals[0].strMeal;
            recipeCategory.innerHTML = data.meals[0].strCategory;
            recipeImg.src = data.meals[0].strMealThumb;
            tutorialVideo.src = data.meals[0].strYoutube.replace("watch?v=", "embed/");

            if (data.meals[0].strTags != null) {
                recipeTags.innerHTML = "Tags: " + data.meals[0].strTags;
            }
            else {
                recipeTags.innerHTML = '"recipe made with love"';
            }

            for (i = 0; i < orderedInstructions.length; i++) {
                if (orderedInstructions[i].trim() !== "") {
                    recipeInstructions.innerHTML += "•" + orderedInstructions[i].trim().replace("\r\n", "") + "<br><br>";
                }
            }
            var ingredients = [];
            var measurements = [];
            // Loops through the strIngredient key and pushes only the ones that aren't null or "" into the ingredients array
            // Also, loops through the strMeasure key and pushes into the measurements array
            for (i = 1; i < 21; i++) {
                var ing = data.meals[0]["strIngredient" + i];
                var measure = data.meals[0]["strMeasure" + i];
                if (ing != null && ing != "") {
                    ingredients.push(ing);
                    measurements.push(measure);
                    ingredientList.innerHTML += `<li>${measure} <span>${ing}</span></li>`
                }
            }

            var recipeObject = {
                Id: Id,
                name: data.meals[0].strMeal,
                image: data.meals[0].strMealThumb,
                measurements: measurements,
                ingredients: ingredients,
            }

            loadModal(ingredients, recipeObject);
        })
}
// --------------------------------------------------------------------------------------------
// ----------------------------------[RECIPE PAGE MODAL]---------------------------------------

function loadModal(ingredients, recipe) {
    var modalBtn = document.querySelector("#modal-btn");
    var nextBtn = document.querySelector("#next-btn");
    var doneBtn = document.querySelector("#done-btn");
    var ingredientContent = document.querySelector("#ingredient-content");
    var doneContent = document.querySelector("#done-content");

    var ingredientsChosen = [];
    var currentIndex = 0;
    // Click event listener for add to cart button
    nextBtn.addEventListener('click', function () {
        var cardArray = document.querySelectorAll("#ingredient-card .checked");

        // Loops through cards checked by user
        for (i = 0; i < cardArray.length; i++) {
            var card = cardArray[i];
            // Adds each cards info to this object
            var ingredientInfo = {
                link: card.querySelector("a").href,
                image: card.querySelector("img").src,
                brand: card.querySelector(".brand").textContent,
                name: card.querySelector(".name").textContent,
                price: card.querySelector(".price").textContent
            }
            // Pushes cards info into array
            ingredientsChosen.push(ingredientInfo);
        }

        // Increases index of array by 1
        currentIndex++;

        // Checking if the end of the array has been reached
        if (currentIndex == ingredients.length) {
            ingredientContent.style.display = "none";
            doneContent.style.display = "block";
            finalIngredients(ingredientsChosen);
        }
        else {
            // Runs searchIngredients function for each ingredient in array
            searchIngredients(ingredients[currentIndex]);
        }
    });

    // Resets Modal when user reclicks button
    modalBtn.addEventListener('click', function () {
        ingredientsChosen = [];
        currentIndex = 0;
        searchIngredients(ingredients[0]);

        ingredientContent.style.display = "block";
        doneContent.style.display = "none";
    });

    // For done button
    doneBtn.addEventListener('click', function () {
        var cardArray = document.querySelectorAll("#chosen-ingredients .checked");
        var cart = {
            recipes: [],
            ingredients: []
        };

        // Checks if there was data saved in local storage already
        // This helps add info to local storage, rather than replace
        if (localStorage.getItem('cart') != null) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }
        // Loops through cards checked by user
        for (i = 0; i < cardArray.length; i++) {
            var card = cardArray[i];
            // Adds each cards info to this object
            var ingredientInfo = {
                link: card.querySelector("a").href,
                image: card.querySelector("img").src,
                brand: card.querySelector(".brand").textContent,
                name: card.querySelector(".name").textContent,
                price: card.querySelector(".price").textContent,
                quantity: 1
            }
            // Checks if new ingredient added already exists
            var ingredientExists = cart.ingredients.find(function (savedIngredient) {
                return savedIngredient.link == ingredientInfo.link;
            })
            if (!ingredientExists) {
                // Pushes cards info into array
                cart.ingredients.push(ingredientInfo);
            }
        }
        // Checks if new recipe added already exists
        var recipeExists = cart.recipes.find(function (savedRecipe) {
            return savedRecipe.Id == recipe.Id;
        });
        if (!recipeExists) {
            cart.recipes.push(recipe);
        }
        // Saved information to localStorage under name cart
        localStorage.setItem('cart', JSON.stringify(cart));

    });
}

// ------------------------------------------------------------------------------------------------
// ------------------------------------[TO RUN ALL SEARCH BARS]------------------------------------

// Recipes API Request for search page
function searchRecipe(recipe) {
    var recipeURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + recipe;

    fetch(recipeURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.meals === null) {
                searchRecipe(" ");
                alert("There Are No Recipes Available For This Search Please Try A Different Search");
                return;
            };

            // finds number of results for search page
            var numOfResults = document.querySelector("#num-of-results");
            numOfResults.innerHTML += data.meals.length;

            for (i = 0; i < data.meals.length; i++) {
                var recipeId = data.meals[i].idMeal;
                var recipeName = data.meals[i].strMeal;
                var recipeImg = data.meals[i].strMealThumb;
                var recipeCategory = data.meals[i].strCategory;
                var searchRow = document.querySelector("#search-row");

                // adds each recipe card to the row
                searchRow.innerHTML += `
                    <div class="col s12 m4 l2-5">
                        <div class="card">
                            <a href="./recipe.html?id=${recipeId}">
                                <div class="card-image">
                                    <img src="${recipeImg}">
                                    <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="far fa-heart"></i></a>
                                </div>
                                <div class="card-content">
                                    <span class="card-title">${recipeName}</span>
                                    <p>${recipeCategory}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    `
            }
        })
}

var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");

// checks for search submit event listener 
if (searchInput) {
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // get search input value
        var search = searchInput.value;
        // change window to search page and the search query is added to the url
        if (search.trim() != "") {
            window.location.href = "search.html?search=" + search;
        };
    });
}

// Checks if user is on the search page
if (window.location.pathname.indexOf("/search.html") > -1) {
    // following checks for the search query and uses it to run the searchRecipe function
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var search = urlParams.get('search');
    searchRecipe(search);
}
// --------------------------------------------------------------------------------------------

// Runs code for modal only on the Recipe HTML Page
if (window.location.pathname.indexOf("/recipe.html") > -1) {

    var ingredientModal = document.querySelector("#ingredient-modal");
    var substituteForm = document.querySelector("#substitute-search");
    var doneContent = document.querySelector("#done-content");

    doneContent.style.display = "none";

    //  Initializer for Ingredients Modal from Materialize
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });

    substituteForm.addEventListener('submit', function (event) {
        event.preventDefault();
        var userSubstitute = document.querySelector("#substitute-input").value;
        searchIngredients(userSubstitute);
    });

    // For modal card checkboxes 
    ingredientModal.addEventListener('click', function (event) {
        // Checks box when clicked
        if (event.target.textContent == "check_box_outline_blank") {
            event.target.textContent = "check_box";
            event.target.parentElement.parentElement.classList.add("checked");
        }
        else if (event.target.textContent == "check_box") {
            event.target.textContent = "check_box_outline_blank";
            event.target.parentElement.parentElement.classList.remove("checked");
        }
    })

    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');
    loadRecipeByID(id);
}
// --------------------------------------------------------------------------------------------
// ---------------------------------[CART PAGE FUNCTIONALITY]----------------------------------

// Runs following code only on the Cart HTML Page
if (window.location.pathname.indexOf("/cart.html") > -1) {

    var chosenRecipes = document.querySelector("#chosen-recipes");
    var cartIngredients = document.querySelector("#cart-ingredients");

    var ingredientModal = document.querySelector("#ingredient-modal");
    var ingredientContent = document.querySelector("#ingredient-content");
    var ingredientCard = document.querySelector("#ingredient-card");
    var substituteForm = document.querySelector("#substitute-search");
    var userSubstitute = document.querySelector("#substitute-input");
    var addIngredientsBtn = document.querySelector("#add-ingred");

    //  Initializer for Ingredients Modal from Materialize
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems);
    });

    // Collapisble Initializer
    document.addEventListener('DOMContentLoaded', function () {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems);
    });

    addIngredientsBtn.addEventListener('click', function () {
        ingredientsChosen = [];

        ingredientContent.style.display = "block";
        userSubstitute.value = "";
        ingredientCard.innerHTML = ``;
        document.querySelector("#ingredient-name").textContent = 'Search for the Ingredient'

        addIngredientsModal();
    });

    substituteForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchIngredients(userSubstitute.value);
    });


    function addIngredientsModal() {
        var addBtn = document.querySelector("#add-btn");

        var cart = {
            recipes: [],
            ingredients: []
        };

        // Checks if there was data saved in local storage already
        // This helps add info to local storage, rather than replace
        if (localStorage.getItem('cart') != null) {
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        // Click event listener for add to cart button
        addBtn.addEventListener('click', function () {
            var cardArray = document.querySelectorAll("#ingredient-card .checked");

            // Loops through cards checked by user
            for (i = 0; i < cardArray.length; i++) {
                var card = cardArray[i];
                // Adds each cards info to this object
                var ingredientInfo = {
                    link: card.querySelector("a").href,
                    image: card.querySelector("img").src,
                    brand: card.querySelector(".brand").textContent,
                    name: card.querySelector(".name").textContent,
                    price: card.querySelector(".price").textContent,
                    quantity: 1
                }
                // Checks if new ingredient added already exists
                var ingredientExists = cart.ingredients.find(function (savedIngredient) {
                    return savedIngredient.link == ingredientInfo.link;
                });
                if (ingredientExists) {
                    ingredientExists.quantity++;
                }
                else {
                    // Pushes cards info into array
                    cart.ingredients.push(ingredientInfo);
                }
            }
            // Saved information to localStorage under name cart
            localStorage.setItem('cart', JSON.stringify(cart));

            userSubstitute.value = "";
            ingredientCard.innerHTML = ``;
            document.querySelector("#ingredient-name").textContent = 'Search for the Ingredient';

            cartIngredients.innerHTML = '';
            // Adds each ingredient from array to cart page
            for (i = 0; i < cart.ingredients.length; i++) {
                cartIngredients.innerHTML += `
                    <li class="collection-item">
                        <div class="row">
                            <div class="col m2">
                                <a href="${cart.ingredients[i].link}" target="_blank">
                                    <img src="${cart.ingredients[i].image}" width="100" height="100"/>
                                </a>
                            </div>
                            <div class="col m5">
                                <p>${cart.ingredients[i].name}</p>
                            </div>
                            <div class="col m1 center-align">
                                <input class="quantity center-align" data-index="${cart.ingredients[i].link}" type="number" value="${cart.ingredients[i].quantity}" min="1">
                            </div>
                            <div class="col m2 center-align">
                                <p>$<span class="price">${(cart.ingredients[i].price * cart.ingredients[i].quantity).toFixed(2)}</span></p>
                            </div>
                            <div class="col m2 center-align">
                                <i class="clear material-icons" data-index="${cart.ingredients[i].link}">clear</i>
                            </div>
                        </div>
                    </li>        
                    `
            }
        });
    }

    // Checks if there was data saved in local storage already
    // This helps add info to local storage, rather than replace
    if (localStorage.getItem('cart') != null) {
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    for (i = 0; i < cart.recipes.length; i++) {
        var recipe = cart.recipes[i];
        var ingredientListHTML = "";
        // Loops through ingredients
        for (index = 0; index < recipe.ingredients.length; index++) {
            ingredientListHTML += `<li>${recipe.measurements[index]} ${recipe.ingredients[index]}</li>`
        }
        chosenRecipes.innerHTML += `
            <li>
                <div class="collapsible-header">
                    <div class="row" style="margin:0">
                        <div class="col m1 center-align">
                            <i class="material-icons">dehaze</i> 
                        </div>
                        <div class="col m3 center-align">
                            <a href="./recipe.html?id=${recipe.Id}" target="_blank"><img src="${recipe.image}" width="100px"/></a> 
                        </div>
                        <div class="col m6 center-align">
                            <p>${recipe.name}</p>
                        </div>
                        <div class="col m2 center-align">
                            <i id="x-btn" class="clear material-icons" data-index="0">clear</i>
                        </div>
                    </div>
                </div>
                <div class="collapsible-body">
                    <ul>
                        ${ingredientListHTML}
                    </ul>
                </div>
            </li>
        `;
    }

    // Adds each ingredient from array to cart page
    for (i = 0; i < cart.ingredients.length; i++) {
        cartIngredients.innerHTML += `
        <li class="collection-item">
            <div class="row">
                <div class="col m2">
                    <a href="${cart.ingredients[i].link}" target="_blank">
                        <img src="${cart.ingredients[i].image}" width="100" height="100"/>
                    </a>
                </div>
                <div class="col m5">
                    <p>${cart.ingredients[i].name}</p>
                </div>
                <div class="col m1 center-align">
                    <input class="quantity center-align" data-index="${cart.ingredients[i].link}" type="number" value="${cart.ingredients[i].quantity}" min="1">
                </div>
                <div class="col m2 center-align">
                    <p>$<span class="price">${(cart.ingredients[i].price * cart.ingredients[i].quantity).toFixed(2)}</span></p>
                </div>
                <div class="col m2 center-align">
                    <i class="clear material-icons" data-index="${cart.ingredients[i].link}">clear</i>
                </div>
            </div>
        </li>        
        `
    }

    // if your recipes section is empty, gives message
    if (chosenRecipes.innerHTML == "") {
        var userRecipeMsg = document.querySelector("#user-recipe-msg");
        userRecipeMsg.innerHTML = `Add ingredients to see your recipes`;
    }

    // if your shopping cart is empty, gives message
    if (cartIngredients.innerHTML == "") {
        var emptyCartMsg = document.querySelector("#empty-cart-msg");
        emptyCartMsg.innerHTML = `Shopping cart is empty`;
    }

    // Total calculator for cart page
    function totalCalculator() {
        var cartPrices = document.querySelectorAll(".price");
        var valueDisplay = document.querySelector("#value-display");
        var totalDisplay = document.querySelector("#total-display");
        var totalValue = 0;
        for (i = 0; i < cartPrices.length; i++) {
            totalValue += parseFloat(cartPrices[i].textContent);
        }
        valueDisplay.textContent = totalValue.toFixed(2);
        totalDisplay.textContent = totalValue.toFixed(2);

    }

    var quantities = document.querySelectorAll(".quantity");
    for (i = 0; i < quantities.length; i++) {
        quantities[i].addEventListener('change', function (event) {
            var ingIndex = event.target.getAttribute("data-index");
            cart.ingredients[ingIndex].quantity = event.target.value;
            // Resaves information when quantity is changed
            localStorage.setItem('cart', JSON.stringify(cart));

            // Changes price on page, as quantity is changed

            var priceElement = event.target.parentElement.parentElement.querySelector(".price");
            priceElement.textContent = (cart.ingredients[ingIndex].quantity * cart.ingredients[ingIndex].price).toFixed(2);

            // Changes estimated total when quantity is changed
            totalCalculator();
        });
    }

    // When x is clicked, the recipe is removed from the array 
    chosenRecipes.addEventListener('click', function (event) {
        if (event.target.textContent == "clear") {
            var ingIndex = event.target.getAttribute("data-index");
            cart.recipes.splice(ingIndex, 1);
            event.target.parentElement.parentElement.parentElement.parentElement.remove();

            // Resaves information when item is deleted
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    });

    // When x is clicked, the ingredient is removed from the array 

    cartIngredients.addEventListener('click', function (event) {
        if (event.target.textContent == "clear") {
            var ingIndex = event.target.getAttribute("data-index");
            cart.ingredients.splice(ingIndex, 1);
            event.target.parentElement.parentElement.parentElement.remove();

            // Resaves information when item is deleted
            localStorage.setItem('cart', JSON.stringify(cart));

            // Changes estimated total when item is deleted
            totalCalculator();
        }
    });

    // For modal card checkboxes 
    ingredientModal.addEventListener('click', function (event) {
        // Checks box when clicked
        if (event.target.textContent == "check_box_outline_blank") {
            event.target.textContent = "check_box";
            event.target.parentElement.parentElement.classList.add("checked");
        }
        else if (event.target.textContent == "check_box") {
            event.target.textContent = "check_box_outline_blank";
            event.target.parentElement.parentElement.classList.remove("checked");
        }
    });

    totalCalculator();

}
// --------------------------------------------------------------------------------------------