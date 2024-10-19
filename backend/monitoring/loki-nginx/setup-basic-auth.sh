echo -n ${LOKI_USER}: > /etc/.htpasswd
openssl passwd -apr1 ${LOKI_PASSWORD} >> /etc/.htpasswd
echo Basic auth for loki configured! User is ${LOKI_USER}
