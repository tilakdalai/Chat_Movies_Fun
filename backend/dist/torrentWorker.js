import WebTorrent from 'webtorrent';
const client = new WebTorrent();
function pickBestFile(torrent) {
    const videoFiles = torrent.files.filter((f) => /\.(mp4|mkv|webm|mov|avi)$/i.test(f.name));
    if (videoFiles.length > 0) {
        return videoFiles.sort((a, b) => b.length - a.length)[0];
    }
    return torrent.files[0];
}
function cleanupTorrent(infoHash) {
    try {
        const existing = client.get(infoHash);
        if (existing) {
            existing.destroy();
        }
    }
    catch (err) {
        // Ignore cleanup errors
    }
}
export async function streamTorrent(magnet, req, res) {
    return new Promise((resolve, reject) => {
        const existing = client.get(magnet);
        const onTorrent = (torrent) => {
            const file = pickBestFile(torrent);
            if (!file) {
                cleanupTorrent(torrent.infoHash);
                return reject(new Error('No playable files in torrent'));
            }
            const total = file.length;
            const range = req.headers.range;
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Accept-Ranges', 'bytes');
            if (range) {
                const match = /bytes=(\d+)-(\d*)/.exec(range);
                if (!match) {
                    res.status(416).end();
                    cleanupTorrent(torrent.infoHash);
                    return resolve();
                }
                const start = parseInt(match[1], 10);
                const end = match[2] ? parseInt(match[2], 10) : total - 1;
                if (start >= total || end >= total) {
                    res.status(416).end();
                    cleanupTorrent(torrent.infoHash);
                    return resolve();
                }
                const chunkSize = end - start + 1;
                res.status(206);
                res.setHeader('Content-Range', `bytes ${start}-${end}/${total}`);
                res.setHeader('Content-Length', String(chunkSize));
                const stream = file.createReadStream({ start, end });
                stream.pipe(res);
                stream.on('end', () => {
                    cleanupTorrent(torrent.infoHash);
                    resolve();
                });
                stream.on('error', (err) => {
                    cleanupTorrent(torrent.infoHash);
                    reject(err);
                });
            }
            else {
                res.status(200);
                res.setHeader('Content-Length', String(total));
                const stream = file.createReadStream();
                stream.pipe(res);
                stream.on('end', () => {
                    cleanupTorrent(torrent.infoHash);
                    resolve();
                });
                stream.on('error', (err) => {
                    cleanupTorrent(torrent.infoHash);
                    reject(err);
                });
            }
        };
        if (existing) {
            onTorrent(existing);
        }
        else {
            client.add(magnet, { destroyStoreOnDestroy: true }, onTorrent);
        }
    });
}
