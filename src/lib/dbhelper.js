// js/dbhelper.js
// import idb from 'idb';

/**
 * Common database helper functions.
 */
class DBHelper {

    constructor() {
        this.restaurants = null;
        this.dbName = 'topRestaurants';
        this.dbVersion = 1;
    }

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    static get DATABASE_URL() {
        //console.log('dbhelper-DATABASE_URL()');
        const port = 1337; // Change this to your server port
        // michael.phan.gen suggestion:
        // https://discussions.udacity.com/t/restaurant-reviews-app-stage-1/675923/8
        //return `https://raw.githubusercontent.com/udacity/mws-restaurant-stage-1/master/data/restaurants.json`;

        // return `http://localhost:${port}/data/restaurants.json`;
        return `http://localhost:${port}/restaurants`;
    }

    /**
     * Fetch all restaurants.
     */
    static fetchRestaurants(callback) {
        //console.log('dbhelper-fetchRestaurants()');

        if (!Array.isArray(this.restaurants) || this.restaurants.length === 0) {
            //console.log('call-fetch');

            this.restaurants = fetch(DBHelper.DATABASE_URL)
                .then(response => response.json())
                .catch(error => {
                    // Oops!. Got an error from server.
                    error.message = (`Request failed-1. Returned status of ${error.message}`);
                    return callback(error.message, null);
                });
        }
        //console.log('this.restaurants' + (this.restaurants));

        return this.restaurants
            .then(restaurants => {
                //console.log('restaurants=' + (restaurants));
                return callback(null, restaurants);
            })
            .catch(error => {
                // Oops!. Got an error from server.
                error.message = (`Request failed-2. Returned status of ${error.message}`);
                return callback(error.message, null);
            });
    }

    /**
     * Fetch a restaurant by its ID.
     */
    static fetchRestaurantById(id, callback) {
        //console.log('dbhelper-fetchRestaurantById()');
        // fetch all restaurants with proper error handling.
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            }
            else {
                const restaurant = restaurants.find(r => r.id == id);
                if (restaurant) { // Got the restaurant
                    callback(null, restaurant);
                }
                else { // Restaurant does not exist in the database
                    callback('Restaurant does not exist', null);
                }
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */
    static fetchRestaurantByCuisine(cuisine, callback) {
        //console.log('dbhelper-fetchRestaurantByCuisine()');
        // Fetch all restaurants  with proper error handling
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            }
            else {
                // Filter restaurants to have only given cuisine type
                const results = restaurants.filter(r => r.cuisine_type == cuisine);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */
    static fetchRestaurantByNeighborhood(neighborhood, callback) {
        //console.log('dbhelper-fetchRestaurantByNeighborhood()');
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            }
            else {
                // Filter restaurants to have only given neighborhood
                const results = restaurants.filter(r => r.neighborhood == neighborhood);
                callback(null, results);
            }
        });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */
    static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        //console.log('dbhelper-fetchRestaurantByCuisineAndNeighborhood()');
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            }
            else {
                let results = restaurants;

                if (cuisine != 'all') { // filter by cuisine
                    results = results.filter(r => r.cuisine_type == cuisine);
                }
                if (neighborhood != 'all') { // filter by neighborhood
                    results = results.filter(r => r.neighborhood == neighborhood);
                }
                callback(null, results);
            }
        });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */
    static fetchNeighborhoods(callback) {
        //console.log('dbhelper-fetchNeighborhoods()');
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            //console.log('dbhelper-fetchNeighborhoods()-restaurants-callback');
            if (error) {
                callback(error, null);
            }
            else {
                // Get all neighborhoods from all restaurants
                const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
                // Remove duplicates from neighborhoods
                const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
                callback(null, uniqueNeighborhoods);
            }
        });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */
    static fetchCuisines(callback) {
        //console.log('dbhelper-fetchCuisines()');
        // Fetch all restaurants
        DBHelper.fetchRestaurants((error, restaurants) => {
            if (error) {
                callback(error, null);
            }
            else {
                // Get all cuisines from all restaurants
                const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
                // Remove duplicates from cuisines
                const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
                callback(null, uniqueCuisines);
            }
        });
    }

    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
        //console.log('dbhelper-urlForRestaurant()');
        return (`./restaurant.html?id=${restaurant.id}`);
    }

    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant) {
        //console.log('dbhelper-imageUrlForRestaurant()');
        if (restaurant.photograph) {
            return (`img/${restaurant.photograph}.jpg`);
        }
    }

    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
        //console.log('dbhelper-mapMarkerForRestaurant()');
        const marker = new google.maps.Marker({
                position: restaurant.latlng,
                title: restaurant.name,
                url: DBHelper.urlForRestaurant(restaurant),
                map: map,
                animation: google.maps.Animation.DROP
            }
        );
        return marker;
    }

}

// module.exports = DBHelper;