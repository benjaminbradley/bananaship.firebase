import { db } from '../lib/myFirebase';
import { ref, update } from 'firebase/database';

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
