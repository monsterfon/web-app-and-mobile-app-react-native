    // Extract category_list column from the CSV
    //extractCategoryList();

    // Count categories from the extracted list
    //countCategories();

    // Display both the category list and counts on the canvas
    //displayCategoryList();



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
        categoryList.push(columns[3]); // Push the category_list column (index 3) to the array
    }
}

function countCategories() {
    for (let i = 0; i < categoryList.length; i++) {
        try {
            let categories = split(categoryList[i], '|'); // Split the categories by '|'
            for (let j = 0; j < categories.length; j++) {
                let category = categories[j].trim(); // Trim any extra spaces

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
