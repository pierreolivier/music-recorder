# Music Recorder

## Raspberry pi setup

- Install deps
```
sudo apt install ffmpeg nginx screen -y
sudo mkdir /var/recordings
```

- Install nodejs: https://github.com/nodesource/distributions#installation-instructions


- Install the server and run
```
npm install
npm run boot
```

- Add crontab
```
@reboot         root    cd /home/po/music-recorder && bash boot.sh
```

- Configure nginx `/etc/nginx/sites-enabled/default`
```
server {

    ...
    
    location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}

	location /recordings {
		root /var;
		autoindex on;		
	}
	
	...
}
```

install node
configure access point
configure nginx
auto start server as root
