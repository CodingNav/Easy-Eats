var addIngredientsBtn = document.querySelector("#add-ingred");
var ingredientContent = document.querySelector("#ingredient-content");
var substituteForm = document.querySelector("#substitute-search");
var userSubstitute = document.querySelector("#substitute-input");
var ingredientCard = document.querySelector("#ingredient-card");

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

//  Initializer for Ingredients Modal from Materialize
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
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

    var ingredientsChosen = [];

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
        document.querySelector("#ingredient-name").textContent = 'Search for the Ingredient'

    });

}


