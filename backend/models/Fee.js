const VALID_STATUSES = ['Paid', 'Unpaid', 'Pending'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function validateFee(data, existingFees = []) {
  const errors = [];

  if (!data.studentId || typeof data.studentId !== 'string') {
    errors.push('Student ID is required');
  }
  if (!data.month || typeof data.month !== 'string' || !data.month.trim()) {
    errors.push('Month is required');
  }
  if (data.amount === undefined || typeof data.amount !== 'number' || data.amount < 0) {
    errors.push('Amount must be a non-negative number');
  }
  if (!data.status || !VALID_STATUSES.includes(data.status)) {
    errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }

  const duplicate = existingFees.find(
    f => f.studentId === data.studentId && f.month === data.month.trim()
  );
  if (duplicate && duplicate.id !== data.id) {
    throw new Error('Fee record already exists for this student and month');
  }

  return {
    id: data.id || generateId(),
    studentId: data.studentId,
    month: data.month.trim(),
    amount: data.amount,
    status: data.status,
    paymentDate: data.status === 'Paid'
      ? (data.paymentDate || new Date().toISOString())
      : null,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

module.exports = { validateFee, generateId, VALID_STATUSES };
