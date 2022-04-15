import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Fab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AlertDialog from './DeleteTaskDialog';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getTasks, selectTasks } from '../../features/tasks/tasksSlice';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import CreateTask from './CreateTask';
import TaskDialog from './TaskDialog';

export default function Dashboard() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [wizardOpen, setWizardOpen] = useState(false);
  const params = useParams();
  const [openTask, setOpenTask] = React.useState(false);
  const { t } = useTranslation();
  const tasks = useSelector(selectTasks);
  const history = useNavigate();
  const headerWeight = { fontWeight: '700' };

  useEffect(() => {
    dispatch(getTasks());
    params.taskId && handleGetTask(params.taskId);
  }, [dispatch]);

  const handleDeleteTask = async (taskId) => {
    setSelectedTaskId(taskId);
    setOpen(true);
  };

  const handleGetTask = async (taskId) => {
    history(`/dashboard/${taskId}`);
    setOpenTask(true);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleWizardOpen = () => {
    setWizardOpen(true);
  };

  return (
    <Grid container direction='row' justifyContent='center' alignItems='center'>
      <AlertDialog
        open={open}
        setOpen={setOpen}
        selectedTaskId={selectedTaskId}
      />
      <Grid container justifyContent={'flex-end'} sx={{ margin: 2 }}>
        <Fab color='primary' onClick={() => handleWizardOpen()}>
          <AddIcon />
        </Fab>
      </Grid>
      <CreateTask wizardOpen={wizardOpen} setWizardOpen={setWizardOpen} />
      <Grid item>
        <TaskDialog open={openTask} setOpenTask={setOpenTask} />
      </Grid>
      <Grid item xs={12} md={8} style={{ height: '100%' }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: '580px' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={headerWeight} align='center'>
                  {t('Title')}
                </TableCell>
                <TableCell sx={headerWeight} align='center'>
                  {t('Description')}
                </TableCell>
                <TableCell sx={headerWeight} align='center'>
                  {t('Status')}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tasks.tasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((task, index) => (
                  <TableRow key={index} hover>
                    <TableCell
                      align='center'
                      onClick={() => handleGetTask(task.id)}
                    >
                      {task.title}{' '}
                    </TableCell>
                    <TableCell
                      align='center'
                      onClick={() => handleGetTask(task.id)}
                    >
                      {task.description}
                    </TableCell>
                    <TableCell
                      align='center'
                      onClick={() => handleGetTask(task.id)}
                    >
                      {task.status}
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        size='large'
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component='div'
          count={tasks.tasks.length}
          onPageChange={handleChangePage}
          page={page}
          rowsPerPageOptions={[10, 25, 50]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </Grid>
  );
}
