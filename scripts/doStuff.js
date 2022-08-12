const  { initializeApp } = require( 'firebase-admin/app');
const { getAuth } = require("firebase-admin/auth");
const admin = require("firebase-admin");

const serviceAccount = require("../private/banana-ship-firebase-adminsdk-ccsnn-d9fc87ea00.json");

const app = initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://banana-ship-default-rtdb.firebaseio.com"
});

// set custom claims on user account, i.e. admin role
//const uid = 'UID';
getAuth()
//.setCustomUserClaims(uid, { admin: true })
.listUsers()
.then((listUsersResult) => {
  listUsersResult.users.forEach((userRecord) => {
    console.log('user', userRecord.toJSON());
  });
})
.catch((err) => console.log("Error:", err))
console.log("did stuff");
