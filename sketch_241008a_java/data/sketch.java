String[] lines;
String[] names;
float[] funding;

void setup() {
  size(800, 600);
  // Load the CSV file
  lines = loadStrings("data/organizations.csv");
  
  // Initialize arrays
  names = new String[lines.length - 1];
  funding = new float[lines.length - 1];
  
  // Parse the CSV file
  for (int i = 1; i < lines.length; i++) {
    String[] columns = split(lines[i], ',');
    names[i - 1] = columns[1];
    funding[i - 1] = float(columns[5].replace("\"", "").replace(",", "").trim());
  }
  
  // Draw the graph
  drawGraph();
}

void drawGraph() {
  background(255);
  textAlign(CENTER, CENTER);
  float barWidth = width / (float)names.length;
  
  for (int i = 0; i < names.length; i++) {
    float barHeight = map(funding[i], 0, max(funding), 0, height - 50);
    fill(0, 0, 255);
    rect(i * barWidth, height - barHeight, barWidth - 10, barHeight);
    fill(0);
    text(names[i], i * barWidth + barWidth / 2, height - 10);
  }
}