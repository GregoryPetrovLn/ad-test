const fs = require("fs");
const readline = require("readline");

class AdPlatform {
  constructor(filename) {
    this.platforms = {};
    this.loadData(filename);
  }

  loadData(filename) {
    const data = fs.readFileSync(filename, "utf8");
    const lines = data.split("\n");
    for (const line of lines) {
      if (line.trim() === "") continue;
      const [platform, locations] = line.split(":");
      this.platforms[platform] = locations.split(",").map((loc) => loc.trim());
    }
  }

  findPlatforms(location) {
    return Object.entries(this.platforms)
      .filter(([_, platformLocations]) =>
        platformLocations.some((pl) => this.isLocationMatch(location, pl))
      )
      .map(([platform, _]) => platform);
  }

  isLocationMatch(targetLocation, platformLocation) {
    const targetParts = targetLocation.split("/").filter(Boolean);
    const platformParts = platformLocation.split("/").filter(Boolean);

    const minLength = Math.min(targetParts.length, platformParts.length);
    return targetParts
      .slice(0, minLength)
      .every((part, index) => part === platformParts[index]);
  }
}

const adPlatform = new AdPlatform("basic.txt");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function promptUser() {
  rl.question('Введите локацию (или "выход" для завершения): ', (answer) => {
    if (answer.toLowerCase() === "выход") {
      rl.close();
      return;
    }

    const result = adPlatform.findPlatforms(answer);
    console.log(`Рекламные площадки для локации ${answer}:`);
    console.log(result.join(", ") || "Нет подходящих площадок");
    console.log();

    promptUser();
  });
}

console.log("Программа для поиска рекламных площадок");
promptUser();
