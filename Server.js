const express = require('express');
const cors = require('cors');
const YTDlpWrap = require('yt-dlp-wrap').default;
const fs = require('fs');
const path = require('path');
// 1. SWITCH TO THE STATIC FFMPEG TOOL
const ffmpegPath = require('ffmpeg-static'); 

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

const binaryPath = path.join(__dirname, 'yt-dlp.exe');
const ytDlpWrap = new YTDlpWrap(binaryPath);

async function initEngine() {
    if (!fs.existsSync(binaryPath)) {
        console.log("[Server] Downloading stable core extraction engine... please wait a moment.");
        try {
            await YTDlpWrap.downloadFromGithub(binaryPath);
            console.log("[Server] Engine core downloaded successfully!");
        } catch (err) {
            console.error("[Server Error] Failed to download engine core automatically:", err.message);
        }
    }
}
initEngine();

// Download API Endpoint
app.post('/api/download', async (req, res) => {
    try {
        const { videoUrl } = req.body;
        console.log(`\n[Server] Received download request for: ${videoUrl}`);
        
        if (!videoUrl) {
            return res.status(400).json({ error: 'No URL provided' });
        }

        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        // 2. EXECUTING WITH THE NEW PATH CONTEXT
        let ytDlpEventEmitter = ytDlpWrap.execStream([
            videoUrl,
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--ffmpeg-location', ffmpegPath, // <--- Passes the stable path directly
            '-o', '-'
        ]);

        ytDlpEventEmitter.pipe(res);

        ytDlpEventEmitter.on('error', (error) => {
            console.error('[Engine Error]:', error.message);
        });

        ytDlpEventEmitter.on('close', () => {
            console.log('[Server] High-quality video streaming complete.');
        });

    } catch (error) {
        console.error("[Server Error]:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to process download' });
        }
    }
});

app.listen(PORT, () => {
    console.log('===================================================');
    console.log(`  SUCCESS: Backend Server running on port ${PORT} `);
    console.log('===================================================');
});
