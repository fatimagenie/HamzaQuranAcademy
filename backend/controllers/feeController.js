const db = require('../db');
const { validateFee } = require('../models/Fee');

// POST /api/fees/create
function createFee(req, res) {
  try {
    const { studentId, month, amount, status, paymentDate } = req.body;
    const data = db.read();

    // Validate input
    const fee = validateFee({ studentId, month, amount, status, paymentDate }, data.fees);

    // Check student exists
    const student = data.students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Save
    data.fees.push(fee);
    db.write(data);

    res.status(201).json({
      message: 'Fee record created',
      fee: { ...fee, student: { id: student.id, name: student.name, course: student.course } }
    });
  } catch (err) {
    if (err.message.includes('already exists')) {
      return res.status(409).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
}

// PUT /api/fees/update-status/:id
function updateFeeStatus(req, res) {
  try {
    const data = db.read();
    const index = data.fees.findIndex(f => f.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Fee record not found' });
    }

    const fee = data.fees[index];

    // Toggle status: Paid <-> Unpaid
    const newStatus = fee.status === 'Paid' ? 'Unpaid' : 'Paid';

    // Update fee
    fee.status = newStatus;
    fee.paymentDate = newStatus === 'Paid' ? new Date().toISOString() : null;
    fee.updatedAt = new Date().toISOString();

    data.fees[index] = fee;
    db.write(data);

    // Get student info
    const student = data.students.find(s => s.id === fee.studentId);

    res.json({
      message: `Fee status updated to ${newStatus}`,
      fee: {
        ...fee,
        student: student
          ? { id: student.id, name: student.name, course: student.course }
          : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/fees/pending
function getPendingFees(req, res) {
  try {
    const data = db.read();

    // Get current month string (e.g. "July 2026")
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    // Filter: current month + Unpaid or Pending
    const pendingFees = data.fees
      .filter(f => f.month === currentMonth && (f.status === 'Unpaid' || f.status === 'Pending'))
      .map(fee => {
        const student = data.students.find(s => s.id === fee.studentId);
        return {
          ...fee,
          student: student
            ? { id: student.id, name: student.name, email: student.email, course: student.course }
            : null
        };
      });

    res.json({
      month: currentMonth,
      count: pendingFees.length,
      fees: pendingFees
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createFee, updateFeeStatus, getPendingFees };
