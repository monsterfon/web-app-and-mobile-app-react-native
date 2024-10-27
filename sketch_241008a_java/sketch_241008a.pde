import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

String[] lines;
HashMap<String, Integer> industryCounts = new HashMap<>();

void setup() {
  size(800, 600);
  // Load the CSV file
  lines = loadStrings("data/organizations.csv");

  // Parse the CSV file and count industries
  for (int i = 1; i < lines.length; i++) {
    String[] columns = split(lines[i], ',');
    String[] industries = split(columns[3], '|');
    for (String industry : industries) {
      industry = industry.trim();
      if (!industry.isEmpty()) {
        industryCounts.put(industry, industryCounts.getOrDefault(industry, 0) + 1);
      }
    }
  }

  // Sort industries by name
  TreeMap<String, Integer> sortedIndustryCounts = new TreeMap<>(industryCounts);

  // Draw the pie chart
  drawPieChart(sortedIndustryCounts);
}

void drawPieChart(TreeMap<String, Integer> sortedIndustryCounts) {
  background(255);
  float total = 0;
  for (int count : sortedIndustryCounts.values()) {
    total += count;
  }

  float lastAngle = 0;
  for (Map.Entry<String, Integer> entry : sortedIndustryCounts.entrySet()) {
    float angle = map(entry.getValue(), 0, total, 0, TWO_PI);
    fill(random(255), random(255), random(255));
    arc(width / 2, height / 2, 400, 400, lastAngle, lastAngle + angle, PIE);
    lastAngle += angle;
  }

  // Add legend
  float legendY = 20;
  for (Map.Entry<String, Integer> entry : sortedIndustryCounts.entrySet()) {
    fill(0);
    textAlign(LEFT, CENTER);
    text(entry.getKey() + ": " + nf((entry.getValue() / total) * 100, 1, 1) + "%", 20, legendY);
    legendY += 20;
  }
}
