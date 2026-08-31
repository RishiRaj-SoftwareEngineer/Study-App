// Role helpers. The user object comes from /users/profile with role populated.
export const getRole = (user) => user?.role?.role_name || null;

export const isStudent = (user) => getRole(user) === 'student';
export const isTeacher = (user) => getRole(user) === 'teacher';
export const isAdmin = (user) => getRole(user) === 'admin';
export const isStaff = (user) => isTeacher(user) || isAdmin(user);
// Where a user should land right after login/signup, based on their role.
export const getHomePath = (user) => {
    const role = getRole(user);
    if (role === 'admin') return '/admin';
    if (role === 'teacher') return '/teacher';
    return '/dashboard';
};
