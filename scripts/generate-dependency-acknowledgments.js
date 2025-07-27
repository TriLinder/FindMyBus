import { exec } from 'child_process';
import fs from "fs";

exec('npm list --json --long', function(error, stdout, stderr) {
    if (error || stderr) {
        console.error("Failed to generate dependency information!");
        return;
    }

    // Parse the JSON output
    const npmList = JSON.parse(stdout);

    // Iterate over the dependencies and extract relevant information
    const dependencies = [];

    for (const dependency of Object.values(npmList.dependencies)) {
        dependencies.push({
            name: dependency.name,
            version: dependency.version,
            license: dependency.license
        });
    }

    // Sort the dependencies by their name (to keep the order consistent)
    dependencies.sort((a, b) => a.name.localeCompare(b.name));

    // Write the extracted information to a JSON file
    const outputPath = "./static/dependencies.json";
    fs.writeFileSync(outputPath, JSON.stringify(dependencies, null, '  '));

    console.log(`Dependency information written to file '${outputPath}' (${dependencies.length} dependencies)`);
});