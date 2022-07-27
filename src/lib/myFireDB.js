import { db } from '../lib/myFirebase';
import { child, get, remove, ref, update } from 'firebase/database';

export const cleanEmail = (email) => {
  return email.toLowerCase().replaceAll('.', '_');
};

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

export const deleteUnit = ({
  userId,
  unitId,
  onSuccess,
} = {}) => {
  remove(ref(db, `/games/default/${userId}/navy/${unitId}`))
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error deleting unit:", error);
  });
};

export const fleetsPath = ({email}) => `/games/default/${cleanEmail(email)}/fleets`;

export const getFleets = async ({
  email,
} = {}) => {
  return get(child(ref(db), fleetsPath({email}))).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data) {
        return Promise.resolve(data);
      }
    } else {
      return Promise.resolve([]);
    }
  }).catch((error) => {
    return Promise.reject(error);
  });
}


export const saveFleet = ({
  userId,
  id,
  data,
  onSuccess,
} = {}) => {
  update(ref(db), {
    [`/games/default/${userId}/fleets/${id}`]: data,
  })
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error saving fleet:", error);
  });
};
