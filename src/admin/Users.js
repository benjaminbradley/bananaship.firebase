import { useEffect, useState } from 'react';
import { set, ref, get, child, onValue, update } from 'firebase/database';
//import EditIcon from "@mui/icons-material/Edit";
//import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../lib/myFirebase';

const Users = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    get(child(ref(db), `users`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          console.log("DEBUG: got data", data);
          const rowData = [];
          for (const [email, userInfo] of Object.entries(data)) {
            rowData.push({
              email,
              createdAt: new Date(parseInt(userInfo.useronly.createdAt,10)).toLocaleString(),
              lastLoginAt: new Date(parseInt(userInfo.useronly.lastLoginAt,10)).toLocaleString(),
            });
          }
          console.log("DEBUG: setRows", rowData);
          setRows(rowData);
        }
      } else {
        console.log("No users available");
      }
    }).catch((error) => {
      console.error('Error reading users:', error);
    });
  }, []);

  const columns = [
//    { field: 'uid', headerName: 'UID' },
    { field: 'email', headerName: 'E-mail', width: 300 },
    { field: 'createdAt', headerName: 'User since', width: 200 },
    { field: 'lastLoginAt', headerName: 'Last login', width: 200 },
  ];
  return (
    <div className='Users'>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          getRowId={(row) => row.email}
        />
    </div>
  )
};
export default Users;
