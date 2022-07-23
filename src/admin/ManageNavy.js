import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { set, ref, get, child, onValue, update } from 'firebase/database';
//import EditIcon from "@mui/icons-material/Edit";
//import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { modalStyle } from '../lib/styles';
import { db } from '../lib/myFirebase';
import UnitForm from './UnitForm';

const ManageNavy = ({
} = {}) => {
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { userId } = useParams();
console.log("modalStyle", modalStyle)
  useEffect(() => {
    reloadNavy();
    onValue(ref(db, `games/default/${userId}/navy`), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        updateNavyFromData(data);
      }
    });
  }, []);

  const updateNavyFromData = (data) => {
    console.log("DEBUG: updateNavyFromData, got data", data);
    const rowData = [];
    for (const [unitGuid, unitData] of Object.entries(data)) {
      rowData.push({
        ...unitData,
        id: unitGuid
      });
    }
    setRows(rowData);
  };

  const reloadNavy = () => {
    get(child(ref(db), `games/default/${userId}/navy`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          updateNavyFromData(data);
        }
      } else {
        console.log("No navy available");
      }
    }).catch((error) => {
      console.error('Error reading navy:', error);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  }

  const doAddShip = () => {
    setModalOpen(true);
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'position', headerName: 'Current Position', width: 170 },
  ];

  return (
    <Box className='Navy'>
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
            Add new unit
          </Typography>
          <UnitForm
            userId={userId}
            closeModal={closeModal}
            onSuccess={reloadNavy}
          />
        </Box>
      </Modal>
      <Typography variant="h6" component="h2">
        {userId}'s Navy
      </Typography>
      <Button onClick={doAddShip} startIcon={<AddCircleOutlineOutlinedIcon/>}>
        Add ship
      </Button>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </Box>
  )
};
export default ManageNavy;
