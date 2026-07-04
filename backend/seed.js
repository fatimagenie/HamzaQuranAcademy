const { write, read } = require('./db');
const { generateId } = require('./models/Student');

const students = [
  { name: 'Ahmed Ali', email: 'ahmed@example.com', phone: '0301-1234567', course: 'Quran Memorization' },
  { name: 'Fatima Khan', email: 'fatima@example.com', phone: '0302-2345678', course: 'Quran Reading' },
  { name: 'Usman Raza', email: 'usman@example.com', phone: '0303-3456789', course: 'Noorani Qaida' },
  { name: 'Ayesha Noor', email: 'ayesha@example.com', phone: '0304-4567890', course: 'Islamic Studies' },
  { name: 'Bilal Ahmad', email: 'bilal@example.com', phone: '0305-5678901', course: 'Quran Memorization' }
];

const months = ['April 2026', 'May 2026', 'June 2026'];

function seed() {
  const now = new Date().toISOString();

  const createdStudents = students.map(s => ({
    id: generateId(),
    name: s.name,
    email: s.email,
    phone: s.phone,
    course: s.course,
    enrolledAt: now,
    createdAt: now,
    updatedAt: now
  }));

  const createdFees = [];
  const statuses = ['Paid', 'Paid', 'Unpaid', 'Pending', 'Paid'];

  for (const student of createdStudents) {
    for (let i = 0; i < months.length; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      createdFees.push({
        id: generateId(),
        studentId: student.id,
        month: months[i],
        amount: 3000,
        status: status,
        paymentDate: status === 'Paid' ? new Date(2026, i + 3, 10).toISOString() : null,
        createdAt: now,
        updatedAt: now
      });
    }
  }

  write({ students: createdStudents, fees: createdFees });

  console.log(`Seeded ${createdStudents.length} students`);
  console.log(`Seeded ${createdFees.length} fee records`);
  console.log('Database ready at data.json');
}

seed();
