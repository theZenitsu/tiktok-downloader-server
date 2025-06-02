const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());

app.get('/download', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  const outputPath = `video_${Date.now()}.mp4`;
  const command = `yt-dlp -f mp4 -o "${outputPath}" "${url}"`;

  exec(command, (err) => {
    if (err) return res.status(500).send('Download failed');

    res.download(path.resolve(outputPath), () => {
      fs.unlinkSync(outputPath); // clean up after download
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
