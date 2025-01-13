let lines;
let categoryList = [];
let categoryCount = {};
let topCategories = [];
let selectedCategory = '';
let selectedCount = 0;
let hoveredCategory = '';
let hoveredCount = 0;
let needsRedraw = true; // Flag to indicate if the canvas needs to be redrawn
let result = [];
let leaderboard = []; // Array to store the leaderboard data

//overflow scroll
//naslov big investicije tvegaega kapitala


function preload() {
    // Load the CSV file
    lines = loadStrings('data/investments_VC.csv');
}

let columnSlider;
let myButton;

function setup() {
    let canvas = createCanvas(1920, 1080);
    canvas.parent('canvas-container'); // Attach canvas to the div
    
 
    
    
    // Create a slider for the number of columns
    columnSlider = createSlider(2, 100, 10); // Min: 1, Max: 20, Initial: 10
    columnSlider.position(10, 10); // Position the slider

    // Add an event listener to the slider
    columnSlider.input(() => needsRedraw = true);


    // Create a button
    myButton = createButton('Ponastavi lestvico');
    myButton.position(10, 50); // Position the button below the slider
    myButton.mousePressed(() => {
        leaderboard.pop(); // Remove the last element from the leaderboard
        buttonClicked(); // Call the buttonClicked function
        leaderboard.pop(); // Remove the last element from the leaderboard
    });

    let sortButton = createButton('Sortiraj lestvico po % prevzetih');
    sortButton.position(10, 90);
    sortButton.mousePressed(() => {
        leaderboard.pop();
        leaderboard.sort((a, b) => parseFloat(b.acquired_count_percent) - parseFloat(a.acquired_count_percent));
        updateLeaderboardTable();
        
    });

    // SORT BY MONEY
    let sortButtonMoney = createButton('Sortiraj lestvico po sredstvih');
    sortButtonMoney.position(10, 130);
    sortButtonMoney.mousePressed(() => {
        leaderboard.pop();
        leaderboard.sort((a, b) => parseFloat(b.funding_avg_usd) - parseFloat(a.funding_avg_usd));
        updateLeaderboardTable();
    });

    // SORT BY FINANCING CIRCLES
    let sortButtonFinance = createButton('Sortiraj lestvico po krogih financiranja');
    sortButtonFinance.position(10, 170);
    sortButtonFinance.mousePressed(() => {
        leaderboard.pop();
        leaderboard.sort((a, b) => parseFloat(b.funding_rounds) - parseFloat(a.funding_rounds));
        updateLeaderboardTable();
    });



    extractCategoryListSUPREME();
    displayCategoryList();
    createLeaderboardTable(); 
}

function buttonClicked() {
    console.log('Button was clicked!');
    leaderboard = [];
    updateLeaderboardTable(); // Update the leaderboard table
}

function extractCategoryListSUPREME() {
    let csvData = lines.join('\n'); // Join the lines into a single string
    let rows = csvData.trim().split('\n').slice(1);
    let markets = {};

    rows.forEach(row => {
        let columns = row.split(',');
        let market = columns[4].trim();
        let funding_total_usd = parseInt(columns[5].replace(/[^0-9]/g, '')) || 0;
        let status = columns[6].replace(/[^0-9]/g, '');
        let country_code = columns[7].replace(/[^0-9]/g, '');
        let concatenatedString = funding_total_usd.toString() + status + country_code;

        funding_total_usd = parseInt(concatenatedString) || 0;
        if (funding_total_usd === 0) return; // Skip this iteration if funding_total_usd is zero

        let valueBetween1And10 = null;
        for (let i = 10; i <= 15; i++) {
            let columnValue = parseInt(columns[i].replace(/,/g, '').replace(/[^0-9]/g, '')) || 0;
            if (columnValue >= 1 && columnValue <= 10) {
                valueBetween1And10 = columnValue;
                break;
            }
        }
        let funding_rounds = valueBetween1And10;

        status = 'operating';
        for (let i = 6; i <= 15; i++) {
            if (columns[i].trim() == 'acquired') {
                status = 'acquired';
                break;
            }
        }

        if (!markets[market]) {
            markets[market] = {
                market_name: market,
                market_count: 0,
                status_count_acquired: 0,
                funding_total_usd: 0,
                funding_rounds: 0
            };
        }

        markets[market].market_count += 1;
        markets[market].funding_total_usd += funding_total_usd;
        markets[market].funding_rounds += funding_rounds;
        if (status === 'acquired') markets[market].status_count_acquired += 1;
    });

    result = Object.values(markets).sort((a, b) => b.market_count - a.market_count);
    // Calculate the average funding_total_usd, funding_rounds and status_count_acquired and save it on index 2
    let totalMarkets = Object.keys(markets).length;
    let avgFundingTotalUSD = 0;
    let avgFundingRounds = 0;
    let avgStatusCountAcquired = 0;

    if (totalMarkets > 0) {
        avgFundingTotalUSD = result.reduce((sum, market) => sum + market.funding_total_usd, 0) / totalMarkets;
        avgFundingRounds = result.reduce((sum, market) => sum + market.funding_rounds, 0) / totalMarkets;
        avgStatusCountAcquired = result.reduce((sum, market) => sum + market.status_count_acquired, 0) / totalMarkets;
    }

    result[2] = {
        market_name: 'POVPREČJE VSEH TRGOV',
        market_count: totalMarkets,
        funding_total_usd: avgFundingTotalUSD,
        funding_rounds: avgFundingRounds,
        status_count_acquired: avgStatusCountAcquired
    };
}

function displayCategoryList() {
    background(200); // Set background to white
    let y = height - 100; // Start drawing histogram above the bottom
    let numColumns = columnSlider.value(); // Get the number of columns from the slider
    let barWidth = width / numColumns; // Width of each bar

    // Get the top categories sorted by market_count in descending order
    const sortedCategories = result.slice(0, numColumns);

    // Draw the histogram bars
    for (let i = 0; i < sortedCategories.length; i++) {
        const categoryData = sortedCategories[i];
        const { market_name, market_count, funding_total_usd, funding_rounds, status_count_acquired } = categoryData;

        // Calculate the height of the bar based on the market_count
        let barHeight = map(market_count, 0, max(result.map(d => d.market_count)), 0, height / 2); // Decreased height scaling factor

        // Draw the bar
        fill(128, 128, 128); // Grey color
        
        rect(i * barWidth, y - barHeight, barWidth - 2, barHeight); // Draw the bar

        // Optional: Add category names above the bars
        fill(0); // Set text color to black
        textAlign(CENTER);

            textSize(13); // Set smaller text size
            text(i + 1, i * barWidth + barWidth / 2, y + 15); // Display category names
    }

    // If a category has been selected, display its count
    if (selectedCategory) {
        displaySelectedCount();
    }
}

function displayHoveredCount(x, y) {
    fill(0); // Set text color to black
    textSize(16);
    textAlign(LEFT);
    text(`Preletena kategorija: ${hoveredCategory} | Število: ${hoveredCount}`, x + 10, y - 10);

    // Display additional information if a category is hovered
    if (hoveredCategory) {
        const hoveredData = result.find(d => d.market_name === hoveredCategory);
        if (hoveredData) {
            const { funding_total_usd, funding_rounds, status_count_acquired, market_count } = hoveredData;
            text(`Povprečna sredstva USD: ${(Math.round(funding_total_usd / market_count / 1e6))}M`, x + 10, y + 10);
            text(`Krogi financiranja: ${(funding_rounds / market_count).toFixed(1)}`, x + 10, y + 30);
            text(`Število prevzetih %: ${((status_count_acquired / market_count) * 100).toFixed(1)}`, x + 10, y + 50);
        }
    }
}

function draw() {
    if (needsRedraw) {
        displayCategoryList();
        needsRedraw = false;
    }

    // Display the number of columns selected by the slider
    fill(0);
    textSize(16);
    textAlign(LEFT);
    text(`Število stolpcev: ${columnSlider.value()}`, columnSlider.x * 2 + columnSlider.width, 25);
    
    // Center the text
    textAlign(CENTER, CENTER);

    // Main title styling
    textSize(60);
    textStyle(BOLD);
    fill(0);
    text(`Kategorije naložb tveganega kapitala`, width / 2, 80);

    // Subtitle styling
    textSize(40);
    textStyle(NORMAL);
    fill(50);
    text(`Razvrščeno po številu podjetij v vsaki tržni kategoriji`, width / 2, 140);

    


    // Display the hovered category name and count
    if (hoveredCategory) {
        displayHoveredCount(mouseX, mouseY);
    }
}

function createLeaderboardTable() {
    const container = document.getElementById("table-container");
    container.innerHTML = ''; // Clear existing content

    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    const headerRow = document.createElement("tr");
    const headers = ["Ime trga", "Povprečna sredstva USD", "Krogi financiranja", "Število prevzetih %"];
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        th.style.border = "1px solid black";
        th.style.padding = "8px";
        th.style.textAlign = "left";
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    container.appendChild(table);
}

function updateLeaderboardTable() {
    const container = document.getElementById("table-container");
    const table = container.querySelector("table");

    // Clear existing rows except the header
    table.querySelectorAll("tr:not(:first-child)").forEach(row => row.remove());

    // Add new rows from the leaderboard array
    leaderboard.forEach(entry => {
        const row = document.createElement("tr");
        Object.values(entry).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            td.style.border = "1px solid black";
            td.style.padding = "8px";
            row.appendChild(td);
        });
        table.appendChild(row);
    });
}

function mouseMoved() {
    // Check which bar is hovered
    const barWidth = width / columnSlider.value(); // Width of each bar based on slider value
    const y = height - 100; // Start drawing histogram above the bottom

    // Get the top categories sorted by market_count in descending order
    const sortedCategories = result.slice(0, columnSlider.value());

    let found = false;
    for (let i = 0; i < sortedCategories.length; i++) {
        const categoryData = sortedCategories[i];
        const { market_name, market_count } = categoryData;
        // Check if mouse is within the bounds of the bar
        if (mouseX > i * barWidth && mouseX < (i + 1) * barWidth && mouseY < y) {
            hoveredCategory = market_name; // Store the hovered category
            hoveredCount = market_count; // Store the count of the hovered category
            found = true;
            break; // Exit loop after finding the hovered bar
        }
    }

    if (!found) {
        hoveredCategory = ''; // Reset if no bar is hovered
        hoveredCount = 0;
    }

    // Redraw histogram to display the hovered category count
    needsRedraw = true;
}

function mousePressed() {
    if (hoveredCategory) {
        const hoveredData = result.find(d => d.market_name === hoveredCategory);
        if (hoveredData) {
            const { funding_total_usd, funding_rounds, status_count_acquired, market_count } = hoveredData;
            const formattedData = {
                market_name: hoveredCategory,
                funding_avg_usd: `${(Math.round(funding_total_usd / market_count / 1e3))} tisoč USD`,
                funding_rounds: (funding_rounds / market_count).toFixed(2),
                acquired_count_percent: ((status_count_acquired / market_count) * 100).toFixed(2)
            };

            // Check if the category already exists in the leaderboard
            const exists = leaderboard.some(entry => entry.market_name === hoveredCategory);
            if (!exists) {
                leaderboard.push(formattedData);
                needsRedraw = true; // Redraw to update the leaderboard
                updateLeaderboardTable(); // Update the leaderboard table
                console.log(leaderboard);
            }
        }
    }
}