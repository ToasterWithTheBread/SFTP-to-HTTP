# SFTP-to-HTTP
Program to grab student files from an SFTP server and run them on a HTTP server for live viewing.

# How to use
Take a look at `example.env` and pass the variables however you want, I recommend Docker but it doesn't matter.

**NO DOCKER**
```
git clone https://github.com/ToasterWithTheBread/SFTP-to-HTTP.git
cd /SFTP-to-HTTP
nano .env (pass your variables here from the example)
npm install
npm run prod
```

**DOCKER**
```
git clone https://github.com/ToasterWithTheBread/SFTP-to-HTTP.git
cd /SFTP-to-HTTP
sudo docker build -t sftp-to-http .
sudo docker run -d \
    --restart unless-stopped \
    -p 3000:3000 \
    -e WEBSERVER_PORT=3000 \
    -e CRON_SCHEDULE="0 * * * *" \
    -e REMOTE_PULL_DIRECTORY= \
    -e SFTP_HOST= \
    -e SFTP_PORT=22 \
    -e SFTP_USERNAME= \
    -e SFTP_PASSWORD= \
    sftp-to-http
```

# Accessing
This program downloads all the files in the directory and hosts them. This works for HTML websites and really anthing you
want. I am sure there is a better way to do this lol but this was simple to make and it works for what we need. To access
the files just go to `http://[your-server-ip]:3000/folder1/folder2/index.html`. This works well because you can link the files inside the HTML and they can all be accessed by the file on the server allowing for styles, complex folder structures, and images.