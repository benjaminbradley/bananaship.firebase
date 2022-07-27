import { useEffect, useState } from 'react';
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

const DataManager = ({
  dbPaths,
  convertDataToRows,
  getRowLabel,
  rowType,
  deleteRow,
  columns,
  userId,
  EditForm,
} = {}) => {
  const { userState } = useUserContext();
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    reloadData();
    onValue(ref(db, dbPaths.list), (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const rowData = convertDataToRows(data);
        setRows(rowData);
      }
    });
  }, [convertDataToRows]);

  const reloadData = () => {
    get(child(ref(db), dbPaths.list)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data) {
          const rowData = convertDataToRows(data);
          setRows(rowData);
        }
      } else {
        console.log(`No data available under ${dbPaths.list}`);
      }
    }).catch((error) => {
      console.error(`Error reading data at ${dbPaths.list}:`, error);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
  }

  const doAdd = () => {
    setFormData({});
    setModalOpen(true);
  }

  const doDelete = (row) => {
    if (!deleteRow) {
      console.log("delete is unsupported");
      return;
    }
    const rowLabel = getRowLabel(row);
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Delete all data associated with ${rowLabel} from database ?`)) {
      deleteRow(row, {
        onSuccess: reloadData,
      });
    }
  }

  const doEdit = (row) => {
    setFormData(row);
    setModalOpen(true);
  }

  const operationsColumn = [];
  if (userState?.admin) {
    operationsColumn.push(
      { field: 'operations', headerName: 'Operations', width: 120,
        renderCell: (params) => {
          return <>
            {deleteRow &&
              <Tooltip title={`Delete ${rowType} and all associated data`}>
                <IconButton onClick={(e) => {
                  e.stopPropagation(); // don't select this row after clicking
                  doDelete(params.row);
                }}>
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            }
            <Tooltip title={`Edit ${rowType}`}>
              <IconButton onClick={(e) => {
                  e.stopPropagation(); // don't select this row after clicking
                  doEdit(params.row);
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
    <Box className={`DataManager DataManager-${rowType}`}>
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
            {formData?.id ? 'Edit ' : 'Add new '}
            {rowType}
          </Typography>
          <EditForm
            userId={userId}
            closeModal={closeModal}
            onSuccess={reloadData}
            formData={formData}
          />
        </Box>
      </Modal>
      {userState?.admin &&
        <Button onClick={doAdd} startIcon={<AddCircleOutlineOutlinedIcon/>}>
          Add {rowType}
        </Button>
      }
      <DataGrid
        rows={rows}
        columns={columns.concat(operationsColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
      />
    </Box>
  )
};
export default DataManager;
