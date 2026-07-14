
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');


downloadvideo = function()
{
const videoUrl = document.getElementById("URL").value;

// Ensure we target the local yt-dlp executable inside your project folder
const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');


if (!fs.existsSync(ytDlpPath)) {
    console.error("CRITICAL: yt-dlp.exe was not found in this folder!");
    console.error("Please download it and place it next to index.js.");
    process.exit(1);
}

console.log("Launching local standalone extraction engine...");

// Instructions for yt-dlp: Download best combined format up to 720p, save as 'video.mp4'
const downloadCommand = `"${ytDlpPath}" -f "best[height<=720]" "${videoUrl}" -o "video.mp4" --no-mtime`;

const downloadProcess = exec(downloadCommand);

// Stream live download logs directly from the engine into your command line
downloadProcess.stdout.on('data', (data) => {
    process.stdout.write(data);
});

downloadProcess.stderr.on('data', (data) => {
    process.stderr.write(`[Engine Alert] ${data}`);
});

downloadProcess.on('close', (code) => {
    if (code === 0) {
        console.log("\n==============================================");
        console.log("SUCCESS! Video completely saved as: video.mp4");
        console.log("==============================================");
    } else {
        console.error(`\nExtraction failed. Engine exited with error code: ${code}`);
    }
});
}