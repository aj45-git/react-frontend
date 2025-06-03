import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TaskService from '../../services/TaskService';

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' }
];

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const history = useHistory();

  const fetchTasks = async () => {
    const res = await TaskService.getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = (taskId, status) => {
    setSelectedStatus(prev => ({ ...prev, [taskId]: status }));
  };

  const handleUpdateClick = (task) => {
    setPendingTask(task);
    setShowDialog(true);
  };

  const handleDialogConfirm = async () => {
    if (pendingTask) {
      const status = selectedStatus[pendingTask.id] || pendingTask.status;
      // Create a new task object with updated status (using backend values)
      const updatedTask = { ...pendingTask, status };
      await TaskService.updateStatus(pendingTask.id, updatedTask);
      fetchTasks();
    }
    setShowDialog(false);
    setPendingTask(null);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setPendingTask(null);
  };

  const handleAddTask = () => {
    history.push('/tasks/add-task');
  };

  const handleDeleteClick = (id) => {
    setDeleteTaskId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      await TaskService.deleteTask(deleteTaskId);
      fetchTasks();
    }
    setShowDeleteDialog(false);
    setDeleteTaskId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setDeleteTaskId(null);
  };

  return (
    <div className="container mt-4">
      <h3>Tasks</h3>
      <button className="btn btn-primary mb-3" onClick={handleAddTask}>Add Task</button>
      <table className="table table-bordered">
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No records found</td>
            </tr>
          ) : (
            tasks.map(task => {
              // Use backend status only (not selectedStatus) for row color
              let rowStyle = {};
              if (task.status === 'IN_PROGRESS') {
                rowStyle = { backgroundColor: '#ffe066' }; // Darker yellow
              } else if (task.status === 'DONE') {
                rowStyle = { backgroundColor: '#81c784' }; // Darker green
              }
              return (
                <tr key={task.id} style={rowStyle}>
                  {/* <td>{task.id}</td> */}
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <select
                      className="form-control"
                      value={selectedStatus[task.id] || task.status}
                      onChange={e => handleStatusChange(task.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        style={{
                          boxShadow: '0 4px 8px rgba(0,0,0,0.12), 0 1.5px 3px rgba(0,0,0,0.18)',
                          border: 'none',
                          fontWeight: 'bold',
                          transition: 'transform 0.1s, box-shadow 0.1s',
                          outline: 'none'
                        }}
                        onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
                        onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        onClick={() => handleUpdateClick(task)}
                        disabled={(selectedStatus[task.id] || task.status) === task.status}
                      >
                        Update Status
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{
                          fontWeight: 'bold',
                          marginLeft: '10px'
                        }}
                        onClick={() => handleDeleteClick(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Confirm Dialog */}
      {showDialog && (
        <div
          className="modal"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog" style={{ margin: 0 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Status Update</h5>
                <button type="button" className="close" onClick={handleDialogCancel}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to update the status to <b>{selectedStatus[pendingTask.id]}</b>?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleDialogCancel}>Cancel</button>
                <button className="btn btn-primary" onClick={handleDialogConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Dialog */}
      {showDeleteDialog && (
        <div
          className="modal"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1050
          }}
        >
          <div className="modal-dialog" style={{ margin: 0 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="close" onClick={handleDeleteCancel}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete this task?
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleDeleteCancel}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDeleteConfirm}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;