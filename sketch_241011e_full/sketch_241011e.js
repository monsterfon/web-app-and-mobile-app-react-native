let lines;
let categoryList = [];
let categoryCount = {};
let topCategories = [];
let selectedCategory = '';
let selectedCount = 0;
let hoveredCategory = '';
let hoveredCount = 0;
let needsRedraw = true; // Flag to indicate if the canvas needs to be redrawn

function preload() {
  // Load the CSV file
  lines = loadStrings('data/organizations.csv', parseCSV);
}

function setup() {
  // Create a canvas for display
  createCanvas(1920, 1080);
  describe('Ali se vlagateljem splača vlagati v startupe?');
}

function parseCSV() {
  let csvData = lines.join('\n');
  console.log(csvData);

  Papa.parse(csvData, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function(results) {
      let rows = results.data;
      let markets = {};

      rows.forEach(row => {
        if (!row.market || !row.funding_total_usd || !row.funding_rounds || !row.status) {
          console.log(`Skipping invalid row: ${JSON.stringify(row)}`);
          return;
        }

        let market = row.market.trim();
        let funding_total_usd = parseInt(row.funding_total_usd.replace(/,/g, '')) || 0;
        let funding_rounds = parseInt(row.funding_rounds) || 0;
        console.log(`Funding Total USD: ${funding_total_usd}, Funding Rounds: ${funding_rounds}`);
        let status = row.status.trim();

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
        isNaN(funding_total_usd) ? console.log(`Invalid funding_total_usd for market: ${market}`) : markets[market].funding_total_usd += funding_total_usd;
        isNaN(funding_rounds) ? console.log(`Invalid funding_rounds for market: ${market}`) : markets[market].funding_rounds += funding_rounds;
        if (status === 'acquired') markets[market].status_count_acquired += 1;
      });

      let result = Object.values(markets);
      console.log(result);

      // Extract category_list column from the CSV
      extractCategoryList();

      // Count categories from the extracted list
      countCategories();

      // Display both the category list and counts on the canvas
      displayCategoryList();
    }
  });
}
