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
  lines = loadStrings('data/organizations.csv');
}

function setup() {
  // Create a canvas for display
  createCanvas(1920, 1080);
  describe('Ali se vlagateljem splača vlagati v startupe?');
  
  extractCategoryListSUPREME();

  // Extract category_list column from the CSV
  extractCategoryList();
  
  // Count categories from the extracted list
  countCategories();
  
  // Display both the category list and counts on the canvas
  displayCategoryList();
}

function extractCategoryListSUPREME() {
  let csvData = `
permalink,name,homepage_url,category_list, market , funding_total_usd ,status,country_code,state_code,region,city,funding_rounds,founded_at,founded_month,founded_quarter,founded_year,first_funding_at,last_funding_at,seed,venture,equity_crowdfunding,undisclosed,convertible_note,debt_financing,angel,grant,private_equity,post_ipo_equity,post_ipo_debt,secondary_market,product_crowdfunding,round_A,round_B,round_C,round_D,round_E,round_F,round_G,round_H  
/organization/waywire,#waywire,http://www.waywire.com,|Entertainment|Politics|Social Media|News|, News ," 17,50,000 ",acquired,USA,NY,New York City,New York,1,2012-06-01,2012-06,2012-Q2,2012,2012-06-30,2012-06-30,1750000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/tv-communications,&TV Communications,http://enjoyandtv.com,|Games|, Games ," 40,00,000 ",operating,USA,CA,Los Angeles,Los Angeles,2,,,,,2010-06-04,2010-09-23,0,4000000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/rock-your-paper,'Rock' Your Paper,http://www.rockyourpaper.org,|Publishing|Education|, Publishing ," 40,000 ",operating,EST,,Tallinn,Tallinn,1,2012-10-26,2012-10,2012-Q4,2012,2012-08-09,2012-08-09,40000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/in-touch-network,(In)Touch Network,http://www.InTouchNetwork.com,|Electronics|Guides|Coffee|Restaurants|Music|iPhone|Apps|Mobile|iOS|E-Commerce|, Electronics ," 15,00,000 ",operating,GBR,,London,London,1,2011-04-01,2011-04,2011-Q2,2011,2011-04-01,2011-04-01,1500000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/r-ranch-and-mine,-R- Ranch and Mine,,|Tourism|Entertainment|Games|, Tourism ," 60,000 ",operating,USA,TX,Dallas,Fort Worth,2,2014-01-01,2014-01,2014-Q1,2014,2014-08-17,2014-09-26,0,0,60000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/club-domains,.Club Domains,http://nic.club/,|Software|, Software ," 70,00,000 ",,USA,FL,Ft. Lauderdale,Oakland Park,1,2011-10-10,2011-10,2011-Q4,2011,2013-05-31,2013-05-31,0,7000000,0,0,0,0,0,0,0,0,0,0,0,0,7000000,0,0,0,0,0,0  
/organization/fox-networks,.Fox Networks,http://www.dotfox.com,|Advertising|, Advertising ," 49,12,393 ",closed,ARG,,Buenos Aires,Buenos Aires,1,,,,,2007-01-16,2007-01-16,0,0,0,4912393,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/0-6-com,0-6.com,http://www.0-6.com,|Curated Web|, Curated Web ," 20,00,000 ",operating,,,,,1,2007-01-01,2007-01,2007-Q1,2007,2008-03-19,2008-03-19,0,2000000,0,0,0,0,0,0,0,0,0,0,0,2000000,0,0,0,0,0,0,0  
/organization/004-technologies,004 Technologies,http://004gmbh.de/en/004-interact,|Software|, Software , -   ,operating,USA,IL,"Springfield, Illinois",Champaign,1,2010-01-01,2010-01,2010-Q1,2010,2014-07-24,2014-07-24,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/01games-technology,01Games Technology,http://www.01games.hk/,|Games|, Games ," 41,250 ",operating,HKG,,Hong Kong,Hong Kong,1,,,,,2014-07-01,2014-07-01,41250,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1-2-3-listo,"1,2,3 Listo",http://www.123listo.com,|E-Commerce|, E-Commerce ," 40,000 ",operating,CHL,,Santiago,Las Condes,1,2012-01-01,2012-01,2012-Q1,2012,2013-02-18,2013-02-18,40000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1-4-all,1-4 All,,|Entertainment|Games|Software|, Software , -   ,operating,USA,NC,NC - Other,Connellys Springs,1,,,,,2013-04-21,2013-04-21,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1-800-dentist,1-800-DENTIST,http://www.1800dentist.com,|Health and Wellness|, Health and Wellness , -   ,operating,USA,CA,Los Angeles,Los Angeles,1,1986-01-01,1986-01,1986-Q1,1986,2010-08-19,2010-08-19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1-800-doctors,1-800-DOCTORS,http://1800doctors.com,|Health and Wellness|, Health and Wellness ," 17,50,000 ",operating,USA,NJ,Newark,Iselin,1,1984-01-01,1984-01,1984-Q1,1984,2011-03-02,2011-03-02,0,0,0,0,1750000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1-618-technology,1.618 Technology,,|Real Estate|, Real Estate , -   ,operating,USA,FL,Orlando,Orlando,1,2013-12-07,2013-12,2013-Q4,2013,2014-01-22,2014-01-22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/10-minutes-with,10 Minutes With,http://10minuteswith.com,|Education|, Education ," 44,00,000 ",operating,GBR,,London,London,2,2013-01-01,2013-01,2013-Q1,2013,2013-01-01,2014-10-09,400000,4000000,0,0,0,0,0,0,0,0,0,0,0,4000000,0,0,0,0,0,0,0  
/organization/10-20-media,10-20 Media,http://www.10-20media.com,|E-Commerce|, E-Commerce ," 20,50,000 ",operating,USA,MD,Baltimore,Woodbine,4,2001-01-01,2001-01,2001-Q1,2001,2009-06-18,2011-12-28,0,0,0,0,0,2050000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1000-corks,1000 Corks,http://1000corks.com,|Search|, Search ," 40,000 ",operating,USA,OR,"Portland, Oregon",Lake Oswego,1,2008-01-01,2008-01,2008-Q1,2008,2011-08-23,2011-08-23,40000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1000-markets,1000 Markets,http://www.1000markets.com,|Marketplaces|Art|E-Commerce|, Marketplaces ," 5,00,000 ",acquired,,,,,1,2009-01-01,2009-01,2009-Q1,2009,2009-05-15,2009-05-15,500000,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  
/organization/1000jobboersen-de,1000jobboersen.de,http://www.1000jobboersen.de,|Curated Web|, Curated Web , -   ,operating,DEU,,Berlin,Berlin,1,,,,,2011-09-16,2011-09-16,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0  

`;


let rows = csvData.trim().split('\n').slice(1);
let markets = {};

rows.forEach(row => {
  let columns = row.split(',');
  let market = columns[4].trim();
  console.log(`Funding Total USD: ${columns[5]}, Funding Rounds: ${columns[13]}`);
  let funding_total_usd = parseInt(columns[5].replace(/[^0-9]/g, '')) || 0;
  let status = columns[6].replace(/[^0-9]/g, '');
  let country_code = columns[7].replace(/[^0-9]/g, '');
  let concatenatedString = funding_total_usd.toString() + status + country_code;

  funding_total_usd = parseInt(concatenatedString) || 0;
  let valueBetween1And10 = null;
  for (let i = 10; i <= 15; i++) {
    let columnValue = parseInt(columns[i].replace(/,/g, '').replace(/[^0-9]/g, '')) || 0;
    if (columnValue >= 1 && columnValue <= 10) {
      valueBetween1And10 = columnValue;
      break;
    }
  }
  let funding_rounds =valueBetween1And10;
  console.log(`Funding Total USD: ${funding_total_usd}, Funding Rounds: ${funding_rounds}`);
  console.log(`    j jj j j j `);
  let status = columns[6].trim();

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

}

function draw() {
  if (needsRedraw) {
    displayCategoryList();
    needsRedraw = false; // Reset the flag after redrawing
  }
  
  // If a category is hovered, display its count near the mouse pointer
  if (hoveredCategory) {
    displayHoveredCount(mouseX, mouseY);
  }
}

function extractCategoryList() {
  // Start from 1 to skip the header line
  for (let i = 1; i < lines.length; i++) {
    let columns = split(lines[i], ','); // Split the line by commas
    categoryList.push(columns[3]);      // Push the category_list column (index 3) to the array
  }
}

function countCategories() {
  for (let i = 0; i < categoryList.length; i++) {
    try {
      let categories = split(categoryList[i], '|');  // Split the categories by '|'
      for (let j = 0; j < categories.length; j++) {
        let category = categories[j].trim();         // Trim any extra spaces
        
        if (!category) continue; // Skip if category is undefined or empty
        
        // Count occurrences of each category
        if (categoryCount[category]) {
          categoryCount[category]++; // Increment count if it already exists
        } else {
          categoryCount[category] = 1; // Initialize count if it's the first occurrence
        }
      }
    } catch (error) {
      console.error(`Error processing categoryList at index ${i}:`, error); // Log the error and continue
    }
  }
}

function displayCategoryList() {
  background(150); // Set background to white
  let y = height - 100; // Start drawing histogram above the bottom
  let barWidth = width / 10; // Width of each bar (increased for wider bars)

  // Get the top 20 categories sorted by count in descending order
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Get only the first 20

  // Draw the histogram bars
  for (let i = 0; i < sortedCategories.length; i++) {
    const [category, count] = sortedCategories[i];
    
    // Calculate the height of the bar based on the count
    let barHeight = map(count, 0, max(Object.values(categoryCount)), 0, height / 2); // Decreased height scaling factor
    
    // Draw the bar
    fill(100, 150, 200); // Bar color
    rect(i * barWidth, y - barHeight, barWidth - 2, barHeight); // Draw the bar

    // Optional: Add category names above the bars
    fill(0); // Set text color to black
    textAlign(CENTER);
    text(category, i * barWidth + barWidth / 2, y + 15); // Display category names
  }

  // If a category has been selected, display its count
  if (selectedCategory) {
    displaySelectedCount();
  }
}

function displaySelectedCount() {
  fill(0); // Set text color to black
  textSize(16);
  textAlign(CENTER);
  text(`Selected Category: ${selectedCategory} | Count: ${selectedCount}`, width / 2, height - 20);
}

function displayHoveredCount(x, y) {
  fill(0); // Set text color to black
  textSize(16);
  textAlign(LEFT);
  text(`Hovered Category: ${hoveredCategory} | Count: ${hoveredCount}`, x + 10, y - 10);
}

function mouseMoved() {
  // Check which bar is hovered
  const barWidth = width / 10; // Width of each bar (increased for wider bars)
  const y = height - 100; // Start drawing histogram above the bottom

  // Get the top 20 categories sorted by count in descending order
  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20); // Get only the first 20

  let found = false;
  for (let i = 0; i < sortedCategories.length; i++) {
    const [category, count] = sortedCategories[i];
    // Check if mouse is within the bounds of the bar
    if (mouseX > i * barWidth && mouseX < (i + 1) * barWidth && mouseY < y) {
      hoveredCategory = category; // Store the hovered category
      hoveredCount = count; // Store the count of the hovered category
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