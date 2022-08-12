import { db } from '../lib/myFirebase';
import { child, get, remove, ref, update } from 'firebase/database';

export const cleanEmail = (email) => {
  return email.toLowerCase().replaceAll('.', '_');
};

export async function getDbData({
  path,
  prepData = (d) => d,
}) {
  return get(child(ref(db), path)).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data) {
        const finalData = prepData(data);
        return Promise.resolve(finalData);
      }
    }
    return Promise.resolve(null);
  }).catch((error) => {
    return Promise.reject(error);
  });
}

export async function updateDbData({
  path,
  data,
}) {
  return update(ref(db), {
    [path]: data,
  })
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
  remove(ref(db, `/games/default/${cleanEmail(email)}`))
  .catch((error) => {
    console.log("Error deleting user's game data:", error);
  });
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


export const getNavyPath = ({userId}) => `games/default/${userId}/navy`;

export const saveUnit = ({
  userId,
  unitId,
  unitData,
  onSuccess,
} = {}) => {
  update(ref(db), {
    [`/${getNavyPath({userId})}/${unitId}`]: unitData,
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
  remove(ref(db, `/${getNavyPath({userId})}/${unitId}`))
  .then(() => {
    if (onSuccess) {
      onSuccess();
    }
  })
  .catch((error) => {
    console.log("Error deleting unit:", error);
  });
};


export const getFleetsPath = ({userId}) => `/games/default/${userId}/fleets`;

export const getFleets = async ({
  email,
} = {}) => {
  let path;
  let prepData;
  if (email) {
    // single user
    path = getFleetsPath({userId: cleanEmail(email)});
    prepData = (data) => {
      return {
        [cleanEmail(email)]: data
      };
    };
  } else {
    // all users (admin)
    path = `/games/default`;
    prepData = (data) =>
      Object.fromEntries(Object.entries(data).map(([id,data]) => [id, data.fleets]));
    ;
  }
  return getDbData({
    path,
    prepData,
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


export const currentTurnPath = `/games/default/currentTurn`;

export const getCurrentTurn = async ({
  admin,
} = {}) => {
  let path;
  let prepData;
  if (admin) {
    // single user
    path = currentTurnPath;
    prepData = (data) => data;
  } else {
    // all users (admin)
    path = `${currentTurnPath}/public`;
    prepData = (data) => ({
      public: data,
    });
  }
  return getDbData({
    path,
    prepData,
  });
};

export const turnPath = (turnNum) => `/games/default/turns/${turnNum}`;
export const publicTurnPath = (turnNum) => `${turnPath(turnNum)}/public`;

export const getTurnDetail = async ({
  admin,
  turnNum,
} = {}) => {
  let path;
  let prepData;
  if (admin) {
    path = turnPath(turnNum);
    prepData = (data) => data;
  } else {
    // all users (admin)
    path = publicTurnPath(turnNum);
    prepData = (data) => ({
      public: data,
    });
  }
  return getDbData({
    path,
    prepData,
  });
};

export const turnSubmissionPath = (userId, turnNum) => `${turnPath(turnNum)}/${userId}/submission`;

export const saveShipMovement = ({
  userId,
  turnNum,
  unitGuid,
  moveInfo,
} = {}) => {
  update(ref(db), {
    [`/games/default/turns/${turnNum}/${userId}/submission/shipMovements/${unitGuid}`]: moveInfo,
  })
  .catch((error) => {
    console.log("Error updating user info:", error);
  });
};
