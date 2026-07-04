const VALID_COURSES = ['Noorani Qaida', 'Quran Reading', 'Quran Memorization', 'Islamic Studies'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validateStudent(data) {
  const errors = [];

  if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
    errors.push('Student name is required');
  }
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.push('Email is required');
  }
  if (!data.course || !VALID_COURSES.includes(data.course)) {
    errors.push(`Course must be one of: ${VALID_COURSES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  return {
    id: generateId(),
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone ? data.phone.trim() : null,
    course: data.course,
    enrolledAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

module.exports = { validateStudent, generateId, VALID_COURSES };
