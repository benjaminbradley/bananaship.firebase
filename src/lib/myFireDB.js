import { db } from '../lib/myFirebase';
import { remove, ref, update } from 'firebase/database';

function cleanEmail(email) {
  return email.toLowerCase().replace('.', '_');
}

export const updateUser = ({
  user,
  userInfo,
} = {}) => {
  update(ref(db), {
    [`/users/${cleanEmail(user.email)}/useronly`]: userInfo,
  })
  .catch((error) => {
    console.log("Error updating user info:", error);
  });
};

export const addUser = ({
  email,
  userData,
  onSuccess,
} = {}) => {
  update(ref(db), {
    [`/users/${cleanEmail(email)}`]: userData,
  })
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error adding user:", error);
  });
};

export const deleteUser = ({
  email,
  onSuccess,
} = {}) => {
  remove(ref(db, `/users/${cleanEmail(email)}`))
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error deleting user:", error);
  });
};

export const saveUnit = ({
  userId,
  unitId,
  unitData,
  onSuccess,
} = {}) => {
  update(ref(db), {
    [`/games/default/${userId}/navy/${unitId}`]: unitData,
  })
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error saving unit:", error);
  });
};
