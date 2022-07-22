import { useEffect, useState } from 'react';
import { set, ref, get, child, onValue, update } from 'firebase/database';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from "@mui/icons-material/Edit";
import TextField from '@mui/material/TextField';
import { db } from '../lib/myFirebase';
import { useUserContext } from '../lib/UserContext';

const Motd = () => {
  const { userState } = useUserContext();
  const [isEditMode, setEditMode] = useState(false);
  const [motd, setMotd] = useState(null);
  /*
  onValue(ref(db, `/motd`), (snapshot) => {
    const data = snapshot.val();
    if (data && data?.message !== motd) {
      console.log("DEBUG: setMotd", data);
      setMotd(data.message);
    }
  });
  */

  useEffect(() => {
    get(child(ref(db), `motd`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data && data?.message !== motd) {
          console.log("DEBUG: setMotd", data);
          setMotd(data.message);
        }
      } else {
        console.log("No MOTD available");
      }
    }).catch((error) => {
      console.error('Error reading MOTD:', error);
    });
  }, []);

  function submitNewMotd() {
    setEditMode(false);
    set(ref(db, `/motd`), {
      message: motd,
      email: userState?.currentUser?.email,
    })
    .catch((error) => {
      console.log("Error updating MOTD:", error);
    });
  }

  return (
    <div className="motd">
      {isEditMode ?
        <>
          <TextField id="motd" label="Enter the new message" variant="outlined"
            value={motd}
            onChange={e => setMotd(e.target.value)}
          />
          <CheckIcon onClick={submitNewMotd}/>
        </>
      :
        <>
          {!motd ? "There is no MOTD" :
            <>
              Message of the day: {motd}
            </>
          }
          <EditIcon onClick={() => setEditMode(true)}/>
        </>
      }
    </div>
  )
};
export default Motd;