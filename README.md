# RYZORT Backend (JWT Auth)

## Setup
1. Jalankan `npm install`
2. Jalankan `npm start`
3. Akses API di `http://localhost:3000`

## Fitur
- User register & login (JWT)
- Main Dragon Tiger
- Deposit, Withdraw
- Admin bisa lihat user & konfirmasi request

## Endpoint
- POST /user/register
- POST /user/login
- GET /user/balance (auth)
- POST /user/deposit (auth)
- POST /user/withdraw (auth)
- POST /user/play (auth)
- GET /user/history (auth)
- GET /admin/users (admin-only)
- GET /admin/requests (admin-only)
- POST /admin/confirm (admin-only)