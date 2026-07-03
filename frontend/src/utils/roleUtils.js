export const ROLES = {
  PATIENT: 'PATIENT',
  DOCTOR: 'DOCTOR',
  ADMIN: 'ADMIN',
};

export const STATUS = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  SUSPENDED: 'SUSPENDED',
  BLOCKED: 'BLOCKED',
};

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.PATIENT: return '/user/dashboard';
    case ROLES.DOCTOR: return '/doctor/dashboard';
    case ROLES.ADMIN: return '/admin/dashboard';
    default: return '/';
  }
};

export const hasRole = (user, role) => {
  return user?.role === role;
};

export const isDoctor = (user) => hasRole(user, ROLES.DOCTOR);
export const isPatient = (user) => hasRole(user, ROLES.PATIENT);
export const isAdmin = (user) => hasRole(user, ROLES.ADMIN);
