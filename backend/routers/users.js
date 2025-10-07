// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const payments = [
        { room: '1104', date: '2025-10-01', dueDate: '2025-10-05', paidDate: '', amount: '5500', status: 'รอชำระ' }
    ];
    res.render('index', {
        username: 'คุณ อเนชา',
        payments,
        bankName: 'ธนาคารไทยพาณิชย์',
        bankAccount: '123-4-56789-0'
    });
});

router.get('/detail', (req, res) => {
    // const payments = [
    //     { room: '1104', date: '2025-10-01', dueDate: '2025-10-05', paidDate: '', amount: '5500', status: 'รอชำระ' }
    // ];
    res.render('invoice-detail');
});

module.exports = router;
