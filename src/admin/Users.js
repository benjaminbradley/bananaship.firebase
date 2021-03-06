import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { ref, get, child, onValue } from 'firebase/database';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import RocketIcon from '@mui/icons-material/Rocket';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
//import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from '@mui/x-data-grid';
import { db } from '../lib/myFirebase';
import { deleteUser } from '../lib/myFireDB';
import { modalStyle } from '../lib/styles';
import UserForm from './UserForm';

function prettyDate(timestamp) {
  if (timestamp)
    return new Date(parseInt(timestamp,10)).toLocaleString();
  return '';
}


const Users = () => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  console.log("modalStyle", modalStyle)

  const updateUsersFromData = (data) => {
    console.log("DEBUG: updateUsersFromData, got data", data);
    const rowData = [];
    for (const [email, userInfo] of Object.entries(data)) {
      rowData.push({
        email,
        createdAt: prettyDate(userInfo?.useronly?.createdAt),
        lastLoginAt: prettyDate(userInfo?.useronly?.lastLoginAt),
      });
    }
    setRows(rowData);
  };

  const reloadUsers = () => {
    get(child(ref(db), `users`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          updateUsersFromData(data);
        }
      } else {
        console.log("No users available");
      }
    }).catch((error) => {
      console.error('Error reading users:', error);
    });
  };

  useEffect(() => {
    reloadUsers();
    onValue(ref(db, `/users`), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        updateUsersFromData(data);
      }
    });
  }, []);

  const closeModal = () => {
    setModalOpen(false);
  }

  const doAddUser = () => {
    setModalOpen(true);
  }

  const doDeleteUser = (id) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Delete all user's data (${id}) from database (does not affect login account) ?`)) {
      deleteUser({
        email: id,
        onSuccess: reloadUsers,
      });
    }
  }

  const columns = [
//    { field: 'uid', headerName: 'UID' },
    { field: 'email', headerName: 'E-mail', width: 300 },
    { field: 'createdAt', headerName: 'User since', width: 200 },
    { field: 'lastLoginAt', headerName: 'Last login', width: 200 },
    { field: 'operations', headerName: 'Operations', width: 120,
      renderCell: (params) => {
        return <>
          <Tooltip title="Delete all of user's data">
            <IconButton onClick={(e) => {
              e.stopPropagation(); // don't select this row after clicking
              doDeleteUser(params.id);
            }}>
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage Navy">
            <IconButton onClick={(e) => {
                e.stopPropagation(); // don't select this row after clicking
                navigate(`/users/${params.id}/navy`)
            }}>
              <RocketIcon/>
            </IconButton>
          </Tooltip>
        </>;
      }
    },
  ];
  return (
    <div className='Users'>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Button onClick={closeModal} style={{float:'right'}}>
            <CloseOutlinedIcon/>
          </Button>
          <Typography variant="h6" component="h2">
            Add new user
          </Typography>
          <UserForm
            closeModal={closeModal}
            onSuccess={reloadUsers}
          />
        </Box>
      </Modal>
      <Button onClick={doAddUser}>
        <AddCircleOutlineOutlinedIcon/>
        <Typography>Add user</Typography>
      </Button>
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
