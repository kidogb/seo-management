import React from 'react';
import { connect } from 'dva';

export const ROLES = Object.freeze({
  ADMIN: 'Admin',
  MANAGER: 'Quản lý',
  USER: 'Cộng tác viên',
});

export const TXT_NO_PERMISSION = `You don't have permission`;
export const TXT_NEW_NO_PERMISSION = `Sorry, you don't have permission to access this page`;

export const FORBIDDEN_PAGE_PATH = '/exception/403';


export const hasRole = (userRoles, role = '') => {
  if (userRoles === role) {
    return true;
  }
  return false;
};

export const hasPermission = (userPermissions, permission = '') => {
  if (Array.isArray(permission)) {
    return false;
  }

  return Array.isArray(userPermissions) && userPermissions.includes(permission);
};

export const hasAnyPermission = (userPermissions, ...checkedPermissions) => {
  if (Array.isArray(userPermissions)) {
    return userPermissions.reduce((acc, curr) => acc || checkedPermissions.includes(curr), false);
  }

  return false;
};

export const hasAllPermissions = (userPermissions, ...checkedPermissions) => {
  if (Array.isArray(userPermissions)) {
    return checkedPermissions.every(cur => userPermissions.includes(cur));
  }

  return false;
};
