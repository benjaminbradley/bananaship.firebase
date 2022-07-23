import { useEffect, useState } from 'react';
import { set, ref, get, child, onValue, update } from 'firebase/database';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
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
    <Box className="motd">
      {isEditMode ?
        <>
          <TextField id="motd" label="Enter the new message" variant="outlined"
            value={motd}
            onChange={e => setMotd(e.target.value)}
            sx={{width: 500}}
          />
          <Button onClick={() => setEditMode(false)} startIcon={<CancelIcon/>}>Cancel</Button>
          <Button onClick={submitNewMotd} startIcon={<CheckIcon/>}>Save</Button>
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
    </Box>
  )
};
export default Motd;