# HW-03

## 1. Http ('src/server.mjs')

Сервер на `net.createServer` (без `http`/`https`), порт **3000**.

### Запуск

```bash
node src/server.mjs
```

## 2. Https ('src/https-server.mjs')

Сервер на tls.createServer (без модуля https), порт 3443, самопідписаний сертифікат.

Для запуску потрібно згенерувати сертифікати у корені проекту

```bash
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout ca-key.pem -out ca-cert.pem -days 365
```

### Запуск

```bash
node src/server.mjs
```

## 3. Debug

### Команда

```bash
openssl s_client -connect localhost:3443 -servername localhost
```

### Фрагмет відповіді

```Connecting to ::1
CONNECTED(00000005)
Can't use SSL_get_servername
depth=0 C=AU, ST=Some-State, O=Internet Widgits Pty Ltd
verify error:num=18:self-signed certificate
verify return:1
depth=0 C=AU, ST=Some-State, O=Internet Widgits Pty Ltd
verify return:1
```

### Пояснення

Код помилки 18 (self-signed) означає, що сертифікат підписаний самим собою, тому openssl його не довіряє — для навчального self-signed це очікувана поведінка.
