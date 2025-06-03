import React, { useState } from 'react';
import TaskService from '../../services/TaskService';
import { useHistory } from 'react-router-dom';

const AddTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    try {
      const res = await TaskService.addTask({ title, description, done: false });
      setAddedId(res.data.id);
      setShowSuccess(true);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    history.push('/tasks');
  };

  return (
    <div className="container mt-4" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <h3 className="text-center">Add Task</h3>
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="form-group">
            <label>Title<span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              placeholder="Task title"
              value={title}
              style={{
                borderColor: error ? 'red' : undefined,
                boxShadow: error ? '0 0 0 0.2rem rgba(255,0,0,.25)' : undefined
              }}
              onChange={e => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
            />
            {error && <div className="text-danger mb-2">{error}</div>}
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit">Add</button>
        </form>

        {/* Success Modal */}
        {showSuccess && (
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
                  <h5 className="modal-title">Task Added</h5>
                </div>
                <div className="modal-body">
                  Task added successfully!<br />
                  <b>Task ID: {addedId}</b>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={handleSuccessOk}>OK</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTask;