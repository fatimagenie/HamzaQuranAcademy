const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateFee } = require('../models/Fee');
const { createFee, updateFeeStatus, getPendingFees } = require('../controllers/feeController');

// POST /api/fees/create — Create a fee record
router.post('/create', createFee);

// PUT /api/fees/update-status/:id — Toggle Paid/Unpaid
router.put('/update-status/:id', updateFeeStatus);

// GET /api/fees/pending — Get pending fees for current month
router.get('/pending', getPendingFees);

// GET /api/fees — Get all fee records (with optional filters)
router.get('/', (req, res) => {
  try {
    const data = db.read();
    let fees = data.fees;

    const { studentId, month, status } = req.query;
    if (studentId) fees = fees.filter(f => f.studentId === studentId);
    if (month) fees = fees.filter(f => f.month === month);
    if (status) fees = fees.filter(f => f.status === status);

    const feesWithStudent = fees.map(fee => {
      const student = data.students.find(s => s.id === fee.studentId);
      return {
        ...fee,
        student: student
          ? { id: student.id, name: student.name, email: student.email, course: student.course }
          : null
      };
    });

    res.json(feesWithStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/fees/:id — Get a single fee record
router.get('/:id', (req, res) => {
  try {
    const data = db.read();
    const fee = data.fees.find(f => f.id === req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });

    const student = data.students.find(s => s.id === fee.studentId);
    res.json({
      ...fee,
      student: student
        ? { id: student.id, name: student.name, email: student.email, course: student.course }
        : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/fees/:id — Delete a fee record
router.delete('/:id', (req, res) => {
  try {
    const data = db.read();
    const index = data.fees.findIndex(f => f.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Fee record not found' });

    data.fees.splice(index, 1);
    db.write(data);
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
