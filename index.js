require("dotenv").config();

const fs = require("fs");
const cron = require("node-cron");

const Client = require("ssh2-sftp-client");
const sftp = new Client("remote-client");

const express = require("express");
const serveIndex = require("serve-index");
const app = express();

// sftp connect
async function connectSFTP() {
	try {
		await sftp.connect({
			host: process.env.SFTP_HOST,
			port: process.env.SFTP_PORT,
			username: process.env.SFTP_USERNAME,
			password: process.env.SFTP_PASSWORD,
		});

		console.log(`[LOG] CONNECTED TO SFTP AT UNIXEPOCH[${Date.now()}]`);
	} catch (e) {
		console.error(`[ERROR] ERROR CONNECTING TO SFTP AT UNIXEPOCH[${Date.now()}]`);
		console.error(e);
	}
}

// download and move
async function downloadAndMoveFiles() {
	try {
		fs.rmSync("download", { recursive: true, force: true });
	} catch (e) {
		console.error(`[ERROR] ERROR CLEARING DOWNLOAD DIRECTORY AT UNIXEPOCH[${Date.now()}]`);
		console.error(e);
	}

	try {
		await sftp.downloadDir(process.env.REMOTE_PULL_DIRECTORY, "download");
	} catch (e) {
		console.error(`[ERROR] ERROR DOWNLOADING FILES FROM REMOTE AT UNIXEPOCH[${Date.now()}]`);
		console.error(e);
	}
}

// cron
cron.schedule(process.env.CRON_SCHEDULE, async () => {
	console.log(`[LOG] SCHEDULED DOWNLOAD AND UPDATE OF REMOTE/LOCAL DIRECTORY AT UNIXEPOCH[${Date.now()}]`);

	await downloadAndMoveFiles();
});

// web hosting
app.get("/%3Cdownload%3E", async (req, res) => {
	console.log(`[LOG] FORCED DOWNLOAD AND UPDATE OF REMOTE/LOCAL DIRECTORY AT UNIXEPOCH[${Date.now()}] IP[${req.ip}]`);

	downloadAndMoveFiles();

	res.status(200).json({
		response: "Started file download",
	});
});

app.listen(process.env.WEBSERVER_PORT, async () => {
	app.use(express.static("download"));
	app.use("/", serveIndex("download", { icons: true }));

	await connectSFTP();

	console.log(`[LOG] STARTED SERVING DIRECTORY ON PORT:${process.env.WEBSERVER_PORT} AT UNIXEPOCH[${Date.now()}]`);
});
