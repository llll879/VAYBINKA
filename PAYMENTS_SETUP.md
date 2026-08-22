# Настройка реальных платежей VYBINKA

1. Создай/активируй аккаунт Stripe и пройди требуемую верификацию.
2. В переменных окружения сервера задай `STRIPE_SECRET_KEY` (live key), `PUBLIC_URL` (полный HTTPS-адрес сайта) и `STRIPE_WEBHOOK_SECRET`.
3. Цены по умолчанию: 100♥=1.99 EUR, 500♥=7.99 EUR, 1000♥=14.99 EUR, 5000♥=59.99 EUR. Их можно изменить через `HEARTS_PRICE_100`, `HEARTS_PRICE_500`, `HEARTS_PRICE_1000`, `HEARTS_PRICE_5000` (в центах).
4. В Stripe добавь webhook `POST https://ТВОЙ-ДОМЕН/api/payments/webhook` с событием `checkout.session.completed`. Секрет webhook помести в `STRIPE_WEBHOOK_SECRET`.
5. В Stripe Dashboard → Payouts укажи свой банковский счёт для получения денег. Stripe сообщает, что первые live-выплаты часто назначаются через 7–14 дней после первой успешной оплаты; сроки зависят от страны/риска.
6. `ALLOW_DEMO_PAYMENTS` оставь выключенным.

Важно: не вставляй `STRIPE_SECRET_KEY` в клиентский JavaScript и не публикуй `.env`.
