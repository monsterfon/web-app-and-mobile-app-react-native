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

function preload() {
    // Load the CSV file
    lines = loadStrings('data/investments_VC.csv');
}

let columnSlider;

function setup() {
    // Create a canvas for display
    createCanvas(1920, 1080);
    describe('Ali se vlagateljem splača vlagati v startupe?');

    // Create a slider for the number of columns
    columnSlider = createSlider(1,120, 10); // Min: 1, Max: 20, Initial: 10
    columnSlider.position(10, 10); // Position the slider

    // Add an event listener to the slider
    columnSlider.input(() => needsRedraw = true);

    extractCategoryListSUPREME();
    displayCategoryList();
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
        market_name: 'THE AVERAGE OF ALL MARKETS',
        market_count: totalMarkets,
        funding_total_usd: avgFundingTotalUSD,
        funding_rounds: avgFundingRounds,
        status_count_acquired: avgStatusCountAcquired
    };
}

function displayCategoryList() {
    background(150); // Set background to white
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
        fill(100, 150, 200); // Bar color
        rect(i * barWidth, y - barHeight, barWidth - 2, barHeight); // Draw the bar

        // Optional: Add category names above the bars
        fill(0); // Set text color to black
        textAlign(CENTER);
        text("", i * barWidth + barWidth / 2, y + 15); // Display category names
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
    text(`Hovered Category: ${hoveredCategory} | Count: ${hoveredCount}`, x + 10, y - 10);

    // Display additional information if a category is hovered
    if (hoveredCategory) {
        const hoveredData = result.find(d => d.market_name === hoveredCategory);
        if (hoveredData) {
            const { funding_total_usd, funding_rounds, status_count_acquired, market_count } = hoveredData;
            text(`Funding avg. USD: ${(Math.round(funding_total_usd / market_count / 1e6))}M`, x + 10, y + 10);
            text(`Funding Rounds: ${(funding_rounds / market_count).toFixed(2)}`, x + 10, y + 30);
            text(`Acquired Count %: ${((status_count_acquired / market_count) * 100).toFixed(2)}`, x + 10, y + 50);
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
    text(`Number of Columns: ${columnSlider.value()}`, columnSlider.x * 2 + columnSlider.width, 25);

    // Display the hovered category name and count
    if (hoveredCategory) {
        displayHoveredCount(mouseX, mouseY);
    }
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

function displaySelectedCount() {
    fill(0); // Set text color to black
    textSize(16);
    textAlign(CENTER);
    text(`Selected Category: ${selectedCategory} | Count: ${selectedCount}`, width / 2, height - 20);
}
