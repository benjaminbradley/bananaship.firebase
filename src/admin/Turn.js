import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from "@mui/icons-material/Edit";
import Modal from '@mui/material/Modal';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { DataGrid, useGridApiContext } from '@mui/x-data-grid';
import { modalStyle } from '../lib/styles';
import { getDbData, getNavyPath, saveShipMovement, turnSubmissionPath, getTurnDetail, updateDbData } from '../lib/myFireDB';
import { useGameContext } from '../lib/GameContext';
import UnitForm from './UnitForm';

const MODALMODE = {
  UNIT: 1,
  FLEET: 2,
};

const CellEditIcon = ({row}) => {
  const apiRef = useGridApiContext();
  return <EditIcon
    onClick={() => apiRef.current.startCellEditMode({id: row.id, field: 'endingPosition'})}
  />;
}

const Turn = () => {
  const {gameState} = useGameContext();
  const { userId, turnNum } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(MODALMODE.UNIT);
  const [formData, setFormData] = useState({});
  const [modalFleetData, setmodalFleetData] = useState([]);
  const [turnSubmitted, setTurnSubmitted] = useState(null);
  const [turnDetail, setTurnDetail] = useState(null);
  const [isTurnEditable, setTurnEditable] = useState(false);

  useEffect(() => {
    getTurnDetail({turnNum})
    .then((data) => setTurnDetail(data))
    .catch((err) => console.log("Error getting turn detail", err));
  }, [turnNum]);

  function getFleetName(fleetId) {
    const fleetName = gameState?.fleets?.[userId]?.[fleetId]?.name || fleetId;
    return fleetName;
  }

  function createRows(shipMovements) {
    // load unit data
    getDbData({
      path: getNavyPath({userId}),
      prepData: e => e,
    }).then(navy => {
      const fleets = JSON.parse(JSON.stringify(gameState?.fleets?.[userId] || {}));
      const newRows = [];
      // group ships under their fleets
      for(const [unitGuid, unitData] of Object.entries(navy ?? [])) {
        const existingMove = shipMovements?.[unitGuid];
        const row = {
          type: 'unit',
          id: unitGuid,
          name: unitData.name,
          startingPosition: unitData.position,
          endingPosition: unitData.position,
          startingFleet: unitData.fleetId,
          endingFleet: unitData.fleetId,
          ...existingMove,
        };
        if (row.endingFleet) {
          if (!('units' in fleets?.[row.endingFleet]))
            fleets[row.endingFleet].units = [];
          fleets[row.endingFleet].units.push(row);
        } else {
          // separate list of ships without fleet
          newRows.push(row);
        }
      }
      // add fleets to display format
      for(const [fleetGuid, fleetData] of Object.entries(fleets)) {
        const existingMove = shipMovements?.[fleetGuid];
        if (fleetData?.units?.length) {
          const fleetRow = {
            type: 'fleet',
            id: fleetGuid,
            name: fleetData.name,
            startingPosition: fleetData.position,
            endingPosition: fleetData.position,
            units: fleetData.units.map((u) => ({
              endingPosition: existingMove?.endingPosition || fleetData.position,
              ...u,
            })),
            ...existingMove,
          }
          newRows.push(fleetRow);
        }
      }
      setRows(newRows)
    })
  }

  function reloadData() {
    getDbData({
      path: turnSubmissionPath(userId, turnNum),
    })
    .then((submission) => {
      createRows(submission ? submission.shipMovements : {});
      setTurnSubmitted(submission?.submitted);
      setTurnEditable(!submission?.submitted && turnDetail?.public?.status === 'OPEN')
    }).catch((error) => {
      console.error('Error reading submission:', error);
    });
  }

  useEffect(() => {
    if (!gameState?.fleets?.[userId]) return;
    reloadData();
  }, [userId, turnDetail, gameState?.fleets?.[userId]])

  const closeModal = () => {
    setModalOpen(false);
  }

  function viewFleetDetail(row) {
    setModalMode(MODALMODE.FLEET);
    setmodalFleetData(row);
    setModalOpen(true);
  }

  function doEdit(row) {
    setFormData({
      ...row,
      position: row.endingPosition,
      fleetId: row.endingFleet,
    });
    setModalMode(MODALMODE.UNIT);
    setModalOpen(true);
  }

  function doSaveMovement(moveInfo) {
    saveShipMovement({
      userId,
      turnNum,
      unitGuid: moveInfo.id,
      moveInfo: {
        type: moveInfo.type,
        name: moveInfo.name,
        startingPosition: moveInfo.startingPosition,
        endingPosition: moveInfo.endingPosition,
        startingFleet: moveInfo.startingFleet || false,
        endingFleet: moveInfo.endingFleet || false,
      },
    });
}

  function doRemoveUnit(unitRow) {
    unitRow.endingFleet = false;
    doSaveMovement(unitRow);
    reloadData();
    closeModal();
  }

  function savePosition(updatedRow, previousRow) {
    if (updatedRow.endingPosition !== previousRow.endingPosition) {
      doSaveMovement(updatedRow);
    }
    return updatedRow;
  }

  function saveFleet({
    userId,
    unitId,
    unitData,
    onSuccess,
  }) {
    const rowUnitData = rows.filter((r) => r.id === unitId).shift();
    doSaveMovement({
      ...rowUnitData,
      endingPosition: unitData.position,
      endingFleet: unitData.fleetId,
    });
    if(onSuccess) onSuccess();
  }

  const columns = [
    { field: 'type', headerName: 'Type', width: 60 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'startingPosition', headerName: 'Starting', width: 100 },
    { field: 'endingPosition', headerName: 'Ending', width: 100,
      editable: true,
      renderCell: (params) => <div className="MuiDataGrid-cellContent">
          {params.row.endingPosition}
          {isTurnEditable &&
            <>
              <div className="hoverIcon"><CellEditIcon row={params.row}/></div>
              <div className="hoverIconSpacer"></div>
            </>
          }
        </div>,
    },
    { field: 'detail', headerName: 'Fleet detail', width: 250,
      renderCell: (params) => {
        if (params.row.type === 'unit') {
          let fleetStatus;
          if (!params.row.startingFleet && params.row.endingFleet) {
            fleetStatus = `(joining) ` + getFleetName(params.row.endingFleet);
          } else if (params.row.startingFleet && !params.row.endingFleet) {
            fleetStatus = `(leaving) ` + getFleetName(params.row.startingFleet);
          } else if (params.row.startingFleet === params.row.endingFleet) {
            fleetStatus = getFleetName(params.row.endingFleet);
          } else {
            fleetStatus = '(no fleet)';
          }
          return <>
            <Tooltip title={isTurnEditable && "edit to change fleet"}>
              <div>
                {fleetStatus}
              </div>
            </Tooltip>
            {isTurnEditable &&
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation();
                  doEdit(params.row);
                }}
              />
            }
          </>;
        } else {
          return <>
            <Tooltip title={params.row.units.map((r) => r.name).join(", ")}>
              <div>{params.row.units.length} unit{params.row.units.length !== 1 && "(s)"}</div>
            </Tooltip>
            {isTurnEditable &&
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation();
                  viewFleetDetail(params.row);
                }}
              />
            }
          </>;
        }
      },
      valueSetter: (params) => {
        const fleetId = params?.value?.toString() || null;
        return { ...params.row, endingFleet: fleetId };
      },
    },
  ];

  function doSubmitTurn() {
    // eslint-disable-next-line no-restricted-globals
    if (confirm(`Submit turn #${turnNum}? Turn cannot be changed after it is submitted.`)) {
      console.log("Submitting turn");
      updateDbData({
        path: turnSubmissionPath(userId, turnNum)+'/submitted',
        data: true,
      })
      .then(() => {
        console.log("turn submitted!");
        reloadData();
      })
      .catch((err) => console.log("Error submitting turn:", err));
    }
  }
  return (
    <Box className="Turn">
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
          {modalMode === MODALMODE.UNIT &&
            <UnitForm
              userId={userId}
              closeModal={closeModal}
              onSuccess={reloadData}
              formData={formData}
              nameEditable={false}
              showPosition={false}
              overrideSaveUnit={saveFleet}
            />
          }
          {modalMode === MODALMODE.FLEET &&
            <>
              <Typography variant="h6" component="h2">
                Fleet detail: {modalFleetData.name}
              </Typography>
              <List>
                {modalFleetData.units.map((unit) =>
                  <ListItem key={unit.id} disablePadding>
                    <Tooltip title="Remove unit from fleet">
                      <ListItemButton onClick={() => doRemoveUnit(unit)}>
                        <ListItemIcon>
                          <RemoveCircleOutlineIcon/>
                        </ListItemIcon>
                      </ListItemButton>
                    </Tooltip>
                    <ListItemText primary={unit.name + (
                      !unit.startingFleet ? `(joining)` : ''
                    )} />
                  </ListItem>
                )}
              </List>
            </>
          }
        </Box>
      </Modal>
      <Typography variant="h6" component="h4">
        {63 < turnNum &&
          <ArrowBackIcon style={{verticalAlign: 'middle'}} className='iconButton'
            onClick={() => navigate(`/users/${userId}/turn/${parseInt(turnNum)-1}`)}
          />
        }
        Turn {turnNum}
        {gameState?.currentTurnNum && turnNum < gameState?.currentTurnNum &&
          <ArrowForwardIcon style={{verticalAlign: 'middle'}} className='iconButton'
            onClick={() => navigate(`/users/${userId}/turn/${parseInt(turnNum)+1}`)}
          />
        }
        {turnDetail?.public?.status &&
          <span style={{padding: '0 10px'}}>
            [{turnSubmitted ? 'SUBMITTED' : turnDetail?.public?.status}]
          </span>
        }
        {isTurnEditable &&
          <Button variant="contained" style={{marginLeft: '10px'}}
            onClick={doSubmitTurn}
          >Submit turn
        </Button>}
        {gameState.currentTurnNum && parseInt(turnNum) !== parseInt(gameState.currentTurnNum) &&
          <Tooltip title={'Go to current turn'}>
            <Button variant="outlined" onClick={() => navigate(`/users/${userId}/turn/${gameState.currentTurnNum}`)}>
              <WorkHistoryIcon/>
              {gameState.currentTurnNum}
            </Button>
          </Tooltip>
        }
      </Typography>
      <DataGrid experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
        rows={rows}
        getRowClassName={(params) => `type-${params.row.type}`}
        isCellEditable={() => isTurnEditable}
        processRowUpdate={savePosition}
        onProcessRowUpdateError={(e) => console.log("Error updating:", e)}
      />
    </Box>
  )
};
export default Turn;