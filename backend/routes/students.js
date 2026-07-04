const express = require('express');
const router = express.Router();
const db = require('../db');
const { validateStudent } = require('../models/Student');

// POST /api/students
router.post('/', (req, res) => {
  try {
    const data = db.read();
    const student = validateStudent(req.body);

    const duplicate = data.students.find(s => s.email === student.email);
    if (duplicate) {
      return res.status(409).json({ error: 'Student with this email already exists' });
    }

    data.students.push(student);
    db.write(data);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/students
router.get('/', (req, res) => {
  try {
    const data = db.read();
    const students = data.students.sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/:id
router.get('/:id', (req, res) => {
  try {
    const data = db.read();
    const student = data.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/students/:id
router.put('/:id', (req, res) => {
  try {
    const data = db.read();
    const index = data.students.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Student not found' });

    const existing = data.students[index];
    const updated = {
      ...existing,
      name: req.body.name !== undefined ? req.body.name.trim() : existing.name,
      email: req.body.email !== undefined ? req.body.email.trim().toLowerCase() : existing.email,
      phone: req.body.phone !== undefined ? (req.body.phone ? req.body.phone.trim() : null) : existing.phone,
      course: req.body.course !== undefined ? req.body.course : existing.course,
      updatedAt: new Date().toISOString()
    };

    data.students[index] = updated;
    db.write(data);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/students/:id
router.delete('/:id', (req, res) => {
  try {
    const data = db.read();
    const index = data.students.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Student not found' });

    data.students.splice(index, 1);
    data.fees = data.fees.filter(f => f.studentId !== req.params.id);
    db.write(data);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
