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
    const prefixes = ['Zeta', 'Alpha', 'Gamma', 'Delta', 'Sigma', 'Orion', 'Vega'];
    const suffixes = ['Prime', 'Nova', 'Centauri', 'Major', 'X', 'Nebula', 'II'];
    
    let rng = new Random(seed);
    const prefix = prefixes[rng.nextInt(0, prefixes.length)];
    const suffix = suffixes[rng.nextInt(0, suffixes.length)];
    
    return `${prefix} ${suffix}`;
}

function generateStar(seed) {
    let rng = new Random(seed);
    console.log(rng.nextFloat(0,1), seed)
    let starColor = generateStarColor(rng.nextFloat(0, 1));
    
    let star = {
        name: generateStarName(seed),
        color: starColor,
        image: starImages[starColor],  // Assign the image based on the star's color
        planets: generatePlanets(seed),
        seed: seed
    };
    
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
    const prefixes = ['Aqua', 'Terra', 'Luna', 'Xen', 'Vulcan', 'Gliese', 'Kepler'];
    const suffixes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    
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
    seed = Math.abs(seed)
    let rng = new Random(seed + 1);  // Adjust seed for planet generation
    let numberOfPlanets = rng.nextInt(1, 6);  // Number of planets between 1 and 6
    let planets = [];
    
    for (let i = 0; i < numberOfPlanets; i++) {
        let type = generatePlanetType(seed, i);
        let properties = generatePlanetProperties(type);
        
        planets.push({
            name: generatePlanetName(seed, i),
            type: type,
            ...properties  // Spread the additional planet properties
        });
    }
    
    return planets;
}

function addCardData(data){
    const entry = document.createElement("div")
    entry.classList.add("card-text")
    entry.textContent = data
    document.getElementById("card-data").appendChild(entry)
}

function updateStar(seed) {
    document.getElementById("card-data").innerHTML = ""
    const starData = generateStar(seed);  // Procedurally generate the star based on seed
    // Update the page with star data
    document.getElementById("navigator-image").src = starData.image;
    addCardData(`Star Name: ${starData.name}`)
    addCardData(`Star Color: ${starData.color}`)
    addCardData(`Star Seed: ${starData.seed}`)
    
    // Update planet list
    // Loop through each planet and add a button for it
    document.querySelector(".navigator-controls").innerHTML = ""
    prevStarBtn()
    currentStarBtn()
    nextStarBtn()
    starData.planets.forEach(planet => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-primary");  // Bootstrap button styling
        button.innerHTML = `<i class="bi bi-globe-asia-australia"></i> ${planet.name}`;
        button.onclick = () => {
            document.getElementById("card-data").innerHTML = ""
            document.querySelector(".navigator-controls").innerHTML = ""
            currentStarBtn()
            // Placeholder action for now
            // Update the page with star data
            document.getElementById("navigator-image").src = planet.image;
            addCardData(`Planet Name: ${planet.name}`)
            addCardData(`Planet Type: ${planet.type}`)
            addCardData(`Planet Atmosphere: ${planet.atmosphere}`)
        };
        document.querySelector(".navigator-controls").appendChild(button)
    });
}

function currentStarBtn() {
    const currentStar = document.createElement("div")
    currentStar.classList.add("btn", "btn-primary")
    currentStar.innerHTML = `<i class="bi bi-star-fill"></i> Current Star`
    currentStar.onclick = () => {
        updateStar(currentSeed)
    }
    document.querySelector(".navigator-controls").appendChild(currentStar)
}
function prevStarBtn(){
    const prevStar = document.createElement("button")
    prevStar.classList.add("btn", "btn-primary")
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
    nextStar.classList.add("btn", "btn-primary")
    nextStar.innerHTML = `<i class="bi bi-star-fill"></i> Next Star`
    nextStar.onclick = () => {
        currentSeed += 1;
        updateStar(currentSeed);
    }
    document.querySelector(".navigator-controls").appendChild(nextStar)
}

let currentSeed = 0;  // Initial seed

updateStar(currentSeed);

