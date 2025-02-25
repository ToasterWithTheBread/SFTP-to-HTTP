require("dotenv").config();

const fs = require("fs");
const cron = require("node-cron");

const Client = require("ssh2-sftp-client");
const sftp = new Client("remote-client");

const express = require("express");
const app = express();

// connect
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

// cron
cron.schedule(process.env.CRON_SCHEDULE, async () => {
	console.log(`[LOG] DOWNLOADING REMOTE DIRECTORY AND UPDATING AT UNIXEPOCH[${Date.now()}]`);

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
});

// web hosting
app.listen(process.env.WEBSERVER_PORT, async () => {
	app.use(express.static("download"));

	await connectSFTP();

	console.log(`[LOG] STARTED SERVING DIRECTORY ON PORT:${process.env.WEBSERVER_PORT} AT UNIXEPOCH[${Date.now()}]`);
});
