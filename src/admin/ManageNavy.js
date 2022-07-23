import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { set, ref, get, child, onValue, update } from 'firebase/database';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useUserContext } from '../lib/UserContext';
import { modalStyle } from '../lib/styles';
import { db } from '../lib/myFirebase';
import { deleteUnit } from '../lib/myFireDB';
import UnitForm from './UnitForm';

const ManageNavy = ({
} = {}) => {
  const { userState } = useUserContext();
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const { userId } = useParams();
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
    setFormData({});
    setModalOpen(true);
  }

  const doDeleteUnit = (row) => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Delete all data associated with unit (${row.name}) from database ?`)) {
      deleteUnit({
        userId,
        unitId: row.id,
        onSuccess: reloadNavy,
      });
    }
  }

  const doEditUnit = (row) => {
    setFormData(row);
    setModalOpen(true);
  }

  const columns = [
    { field: 'name', headerName: 'Name', width: 100 },
    { field: 'position', headerName: 'Current Position', width: 170 },
  ];

  if (userState?.admin) {
    columns.push(
      { field: 'operations', headerName: 'Operations', width: 120,
        renderCell: (params) => {
          return <>
            <Tooltip title="Delete unit and all associated data">
              <IconButton onClick={(e) => {
                e.stopPropagation(); // don't select this row after clicking
                doDeleteUnit(params.row);
              }}>
                <DeleteIcon/>
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit unit">
              <IconButton onClick={(e) => {
                  e.stopPropagation(); // don't select this row after clicking
                  doEditUnit(params.row);
              }}>
                <EditIcon/>
              </IconButton>
            </Tooltip>
          </>;
        }
      }
    );
  }

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
            formData={formData}
          />
        </Box>
      </Modal>
      <Typography variant="h6" component="h2">
        {userId}'s Navy
      </Typography>
      {userState?.admin &&
        <Button onClick={doAddShip} startIcon={<AddCircleOutlineOutlinedIcon/>}>
          Add ship
        </Button>
      }
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
