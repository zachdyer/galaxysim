class Random {
    constructor(seed) {
        // Modify the seed to spread them out
        this.seed = (seed * 9301 + 49297) % 233280;  // Example modification
    }
    
    next() {
        this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
        return this.seed / 4294967296;  // Return a float between 0 and 1
    }
    
    nextFloat(min, max) {
        return min + this.next() * (max - min);
    }

    nextInt(min, max) {
        return Math.floor(this.nextFloat(min, max));
    }
}



// Preload the star images
let starImages = {
    "Red": "img/stars/red-star.webp",
    "Orange": "img/stars/orange-star.webp",
    "Yellow": "img/stars/yellow-star.webp",
    "White": "img/stars/white-star.webp",
    "Blue": "img/stars/blue-star.webp"
};

function generateStarName(seed) {
    seed = Math.abs(seed)
    const prefixes = ['Zeta', 'Alpha', 'Gamma', 'Delta', 'Sigma', 'Orion', 'Vega']
    const suffixes = ['Prime', 'Nova', 'Centauri', 'Major', 'X', 'Nebula', 'II']
    
    let rng = new Random(seed);
    const prefix = prefixes[rng.nextInt(0, prefixes.length)];
    const suffix = suffixes[rng.nextInt(0, suffixes.length)];
    
    return `${prefix} ${suffix}`;
}

let cachedStar = null;  // Global variable to cache the star

function clearCache() {
    cachedStar = null;
}


function generateStar(seed) {
    // Check if the star with this seed is already cached
    if (cachedStar && cachedStar.seed === seed) {
        console.log("Using cached star data for seed:", seed);
        return cachedStar;  // Return the cached star if it exists
    }

    console.log("Generating new star data for seed:", seed);
    
    let rng = new Random(seed);
    let starColor = generateStarColor(rng.nextFloat(0, 1));
    
    let star = {
        name: generateStarName(seed),
        color: starColor,
        image: starImages[starColor],  // Assign the image based on the star's color
        planets: generatePlanets(seed),  // Planets are generated here
        seed: seed
    };
    
    // Cache the generated star
    cachedStar = star;
    
    return star;
}


function generateStarColor(seed) {
    let rng = new Random(seed);
    let randomValue = rng.nextFloat(0, 1);  // More random value generated from seed
    
    if (randomValue < 0.1) return 'Red';      // 10% chance for Red
    else if (randomValue < 0.3) return 'Orange';  // 20% chance for Orange
    else if (randomValue < 0.5) return 'Yellow';  // 20% chance for Yellow
    else if (randomValue < 0.7) return 'White';   // 20% chance for White
    else return 'Blue';  // 30% chance for Blue
}


function generatePlanetName(seed, index) {
    seed = Math.abs(seed)
    const prefixes = ['Aqua', 'Terra', 'Luna', 'Xen', 'Vulcan', 'Gliese', 'Kepler']
    const suffixes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    
    let rng = new Random(seed + index);  // Slightly modify the seed for each planet
    const prefix = prefixes[rng.nextInt(0, prefixes.length)];
    const suffix = suffixes[rng.nextInt(0, suffixes.length)];
    
    return `${prefix} ${suffix}`;
}

function generatePlanetType(seed, index) {
    const planetTypes = ['Terrestrial', 'Gas Giant', 'Ice Planet', 'Lava Planet', 'Desert Planet'];
    
    let rng = new Random(seed + index);  // Slightly adjust the seed for each planet
    return planetTypes[rng.nextInt(0, planetTypes.length)];
}

function generatePlanetProperties(type) {
    switch (type) {
        case 'Terrestrial':
            return {
                atmosphere: Math.random() > 0.5 ? "Breathable" : "Toxic",
                temperature: `${Math.floor(Math.random() * 50)}°C`,
                resources: Math.floor(Math.random() * 1000),
                image: "img/planets/terrestrial-planet.webp"
            };
        case 'Gas Giant':
            return {
                atmosphere: "None",
                temperature: `-100°C`,
                resources: Math.floor(Math.random() * 500) + 500,
                image: "img/planets/gas-giant-planet.webp"
            };
        case 'Ice Planet':
            return {
                atmosphere: Math.random() > 0.5 ? "Thin" : "None",
                temperature: `-150°C`,
                resources: Math.floor(Math.random() * 200),
                image: "img/planets/ice-planet.webp"
            };
        case 'Lava Planet':
            return {
                atmosphere: "Toxic",
                temperature: `${Math.floor(Math.random() * 500 + 500)}°C`,
                resources: Math.floor(Math.random() * 1000),
                image: "img/planets/lava-planet.webp"
            };
        case 'Desert Planet':
            return {
                atmosphere: Math.random() > 0.5 ? "Thin" : "Breathable",
                temperature: `${Math.floor(Math.random() * 50 + 30)}°C`,
                resources: Math.floor(Math.random() * 800),
                image: "img/planets/desert-planet.webp"
            };
    }
}

function generatePlanets(seed) {
    let rng = new Random(seed + 1);  // Adjust seed for planet generation
    let numberOfPlanets = rng.nextInt(1, 6);  // Generate between 1 and 6 planets
    let planets = [];
    
    for (let i = 0; i < numberOfPlanets; i++) {
        let type = generatePlanetType(seed, i);
        let properties = generatePlanetProperties(type);
        
        planets.push({
            name: generatePlanetName(seed, i),
            type: type,
            ...properties,
            pointsOfInterest: generatePointsOfInterest(type, seed + i)  // Generate POIs based on planet type
        });
    }
    
    return planets;  // Return the generated planets
}

const poiPools = {
    "Terrestrial": [
        { name: "Mountain Range", action: "Explore", description: "A vast mountain range with hidden resources." },
        { name: "Underground Cave", action: "Mine", description: "A deep cave filled with minerals.", img: "img/pois/underground-cave-poi.webp" },
        { name: "Alien Ruins", action: "Investigate", description: "Ancient ruins of an unknown civilization." }
    ],
    "Gas Giant": [
        { name: "Storm Front", action: "Analyze", description: "A massive storm raging across the atmosphere." },
        { name: "Floating Island", action: "Research", description: "A rare floating island suspended in the atmosphere.", img: "img/pois/floating-island-poi.webp" }
    ],
    "Ice Planet": [
        { name: "Frozen Lake", action: "Research", description: "A mysterious frozen lake with possible signs of life." },
        { name: "Glacier Field", action: "Survey", description: "A vast field of ice, ideal for mineral extraction.", img: "img/pois/glacier-field-poi.webp" }
    ],
    "Lava Planet": [
        { name: "Volcanic Region", action: "Survey", description: "A fiery volcanic landscape full of danger and rewards.", img: "img/pois/volcanic-region-poi.webp" },
        { name: "Lava River", action: "Analyze", description: "A flowing river of molten lava, rich in rare minerals." }
    ],
    "Desert Planet": [
        { name: "Sand Dunes", action: "Explore", description: "A vast desert with potential hidden resources.", img: "img/pois/sand-dunes-poi.webp" },
        { name: "Oasis", action: "Investigate", description: "A rare oasis in the middle of the desert, teeming with life.", img: "img/pois/oasis-poi.webp" }
    ]
};

function generatePointsOfInterest(planetType, seed) {
    let rng = new Random(seed);  // Use the seed to generate consistent POIs

    const availablePOIs = [...poiPools[planetType]];  // Copy the array using the spread operator to prevent mutation
    const numPOIs = rng.nextInt(1, availablePOIs.length);  // Select a random number of POIs between 1 and the total
    const selectedPOIs = [];

    for (let i = 0; i < numPOIs; i++) {
        const randomIndex = rng.nextInt(0, availablePOIs.length);  // Select a random POI
        selectedPOIs.push(availablePOIs[randomIndex]);
        availablePOIs.splice(randomIndex, 1);  // Remove selected POI to avoid duplicates
    }

    return selectedPOIs;
}

function addCardData(data){
    const entry = document.createElement("div")
    entry.classList.add("card-text")
    entry.textContent = data
    document.getElementById("card-data").appendChild(entry)
}

function updateStar(seed) {
    // Check if the star is already cached
    if (!cachedStar || cachedStar.seed !== seed) {
        cachedStar = generateStar(seed);  // Generate and cache the star data
        cachedStar.seed = seed;  // Attach the seed to the cached star for reference
    } else {
        console.log("Using cached star data for seed:", seed);
    }

    const starData = cachedStar;  // Use the cached star data
    
    // Update the page with star data
    document.getElementById("navigator-image").src = starData.image;
    document.getElementById("navigator-title").innerHTML = `<i class="bi bi-star-fill"></i> ${starData.name}`
    document.getElementById("card-data").innerHTML = "";
    addCardData(`Star Color: ${starData.color}`);
    addCardData(`Star Seed: ${starData.seed}`);
    
    // Update planet list
    document.querySelector(".navigator-controls").innerHTML = "";
    prevStarBtn();
    nextStarBtn();

    // Loop through each planet and add a button for it
    starData.planets.forEach(planet => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-secondary");
        button.innerHTML = `<i class="bi bi-globe-asia-australia"></i> ${planet.name}`;
        button.onclick = () => updatePlanetView(planet);  // Call updatePlanetView here
        document.querySelector(".navigator-controls").appendChild(button);
    });
}

let currentPlanet = null;  // Global variable to store the current planet

function updatePlanetView(planet) {
    document.getElementById("navigator-title").innerHTML = `<i class="bi bi-globe-asia-australia"></i> ${planet.name}`
    currentPlanet = planet;  // Track the current planet globally

    // Update the page with planet data
    document.getElementById("navigator-image").src = planet.image || 'path_to_default_planet_image';  // Use planet image or fallback
    document.getElementById("card-data").innerHTML = "";  // Clear previous data

    addCardData(`Planet Type: ${planet.type}`);
    addCardData(`Planet Atmosphere: ${planet.atmosphere}`);

    // Clear previous controls and update with POI buttons
    const navigatorControls = document.querySelector(".navigator-controls");
    navigatorControls.innerHTML = "";  // Clear old buttons

    currentStarBtn();  // Add a button to return to the star view

    // Make sure we are correctly adding the POI buttons
    planet.pointsOfInterest.forEach(poi => {
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-primary");
        btn.innerHTML = `${poi.name}`;
        btn.onclick = () => updatePOIView(poi);  // Drill down to POI view
        navigatorControls.appendChild(btn);  // Append POI button
    });
}

function updatePOIView(poi) {
    document.getElementById("navigator-title").innerHTML = `<i class="bi bi-geo-fill"></i> ${poi.name}`
    document.getElementById("navigator-image").src = poi.img
    document.getElementById("card-data").innerHTML = "";  // Clear the card data
    addCardData(`Action: ${poi.action}`);
    addCardData(`Description: ${poi.description}`);

    // Clear previous controls and add a back button to the planet view
    const navigatorControls = document.querySelector(".navigator-controls");
    navigatorControls.innerHTML = "";  // Clear old buttons

    // Back button to go back to planet view using `currentPlanet`
    const backButton = document.createElement("button");
    backButton.classList.add("btn", "btn-outline-secondary");
    backButton.textContent = "Back to Planet";
    backButton.onclick = () => updatePlanetView(currentPlanet);  // Go back to planet view using `currentPlanet`
    navigatorControls.appendChild(backButton);
}


function currentStarBtn() {
    const currentStar = document.createElement("div");
    currentStar.classList.add("btn", "btn-warning");
    currentStar.innerHTML = `<i class="bi bi-star-fill"></i> Current Star`;
    currentStar.onclick = () => {
        updateStar(currentSeed);  // Use cached data when updating the star view
    };
    document.querySelector(".navigator-controls").appendChild(currentStar);
}

function prevStarBtn(){
    const prevStar = document.createElement("button")
    prevStar.classList.add("btn", "btn-warning")
    prevStar.innerHTML = `<i class="bi bi-star-fill"></i> Previous Star`
    prevStar.onclick = () => {
        if (currentSeed > 0) {  // Only subtract if currentSeed is greater than 0
            currentSeed -= 1;
            updateStar(currentSeed);
        }
    }
    document.querySelector(".navigator-controls").appendChild(prevStar)
}
function nextStarBtn() {
    const nextStar = document.createElement("div")
    nextStar.classList.add("btn", "btn-warning")
    nextStar.innerHTML = `<i class="bi bi-star-fill"></i> Next Star`
    nextStar.onclick = () => {
        currentSeed += 1;
        updateStar(currentSeed);
    }
    document.querySelector(".navigator-controls").appendChild(nextStar)
}

let currentSeed = 0;  // Initial seed

window.onload = function() {
    updateStar(currentSeed);  // Call once when the page fully loads
};


