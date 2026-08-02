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
node src/server.mjs
```

### Фрагмет відповіді

```Start Time: 1785689504
    Timeout   : 7200 (sec)
    Verify return code: 18 (self-signed certificate)
    Extended master secret: no
    Max Early Data: 0
```

### Пояснення

Код помилки 18 (self-signed) означає, що сертифікат підписаний самим собою, тому openssl його не довіряє — для навчального self-signed це очікувана поведінка.
