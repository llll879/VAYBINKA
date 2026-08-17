# Публичный запуск VYBINKA

1. Node.js 20+.
2. `npm ci` или `npm install`.
3. Заполнить `.env`.
4. `npm start`.
5. Поставить Nginx/Caddy перед Node и включить HTTPS.
6. Проксировать WebSocket `/` на тот же Node-процесс.
7. Делать бэкап `data/vybinka.sqlite` и каталога `uploads/`.
8. Для жалоб задать SMTP. Без SMTP жалобы сохраняются в БД, но письмо не отправляется.
9. Для AI задать `MISTRAL_API_KEY` на сервере. Никогда не помещайте его в `public/`.
