docker run -it --rm --name certbot -v './certs:/etc/letsencrypt' certbot/certbot certonly --manual -d '*.fapstars.online'

# на сайте домена разместить TXT запись с кодом, который напишет скрипт
