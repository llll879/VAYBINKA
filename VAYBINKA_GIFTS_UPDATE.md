# VYBINKA — Hearts & Gifts update

## Added

- Internal currency **♥ Сердца** with wallet balance.
- Gift catalog based on the supplied artwork, split into individual PNG assets.
- Common / legendary / secret gift tiers.
- Sending gifts to another VYBINKA user.
- Received-gifts collection.
- Wishlist stored locally on the device.
- Profile music upload + HTML audio player.
- Mood selector.
- Privacy settings: profile, music, activity and messages.
- Profile sharing.
- Daily demo bonus.
- Admin account with a protected admin panel.
- Admin heart grant/revoke.
- Admin free gift grant.
- Admin user search and basic statistics.
- Mobile-friendly gift grid and wallet UI.
- Button/touch compatibility layer from the previous fix remains enabled.

## Admin

The only administrator username is configured through `.env` as `ADMIN_USERNAME=@VYBINKA`.
The password is read from `ADMIN_PASSWORD` and is never hard-coded into the JavaScript client.

## Payments

The included `/api/hearts/demo-purchase` endpoint is intentionally **demo-only**: it adds virtual hearts without charging a card or moving real money.

For real-money sales, a production deployment needs a compliant payment provider, server-side webhook verification, refund handling, fraud controls, terms/refund policy and an adult/legal account owner where required. Do not put a payment secret key into `client.js`.

## Gift artwork

The supplied image was split into individual gift assets under:

`public/assets/gifts/`

A weapon-themed decorative gift from the source artwork is not activated in the interactive catalog.

## Changed files

- `server.js`
- `public/client.js`
- `public/index.html`
- `.env`
- `.env.example`
- `VAYBINKA_GIFTS_UPDATE.md`

## New assets

- `public/assets/gifts/*.png`
