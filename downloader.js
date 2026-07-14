// downloader.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const URL=string(document.getElementById("downloadbtn").value);

function downloadVideo(videoUrl) {
    const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');

    if (!fs.existsSync(ytDlpPath)) {
        console.error("CRITICAL: yt-dlp.exe was not found!");
        return;
    }

    console.log("Launching extraction engine...");
    const downloadCommand = `"${ytDlpPath}" -f "best[height<=720]" "${videoUrl}" -o "video.mp4" --no-mtime`;

    const downloadProcess = exec(downloadCommand);

    downloadProcess.stdout.on('data', (data) => process.stdout.write(data));
    downloadProcess.stderr.on('data', (data) => process.stderr.write(data));
    downloadProcess.on('close', (code) => {
        if (code === 0) console.log("\nSUCCESS! Video saved.");
        else console.error(`\nFailed with code: ${code}`);
    });
}

// For testing purposes, pass a hardcoded URL directly in Node
downloadVideo(URL);
