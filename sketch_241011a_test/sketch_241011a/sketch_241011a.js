let lines;
let industryCounts = {};

function preload() {
  // Load the CSV file
  lines = loadStrings("data/organizations.csv", onLoadSuccess, onLoadError);
}

function onLoadSuccess() {
  parseCSV();
}

function onLoadError(err) {
  console.error("Error loading CSV:", err);
}

function setup() {
  createCanvas(800, 600);
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

      extractCategoryList();
      countCategories();
      displayCategoryList();
    },
    error: function(err) {
      console.error("Error during CSV parsing:", err);
    }
  });
}
