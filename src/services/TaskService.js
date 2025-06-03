import axios from 'axios';

const TASK_API_BASE_URL = "http://localhost:8080/api/v1/tasks";

// Common headers for all requests (add or modify as needed)
const config = {
  headers: {
    'Content-Type': 'application/json',
    // Add any other headers here, e.g. Authorization
    // 'Authorization': 'Bearer <token>'
  }
};

class TaskService {
  getTasks() {
    return axios.get(TASK_API_BASE_URL, config);
  }
  addTask(task) {
    return axios.post(TASK_API_BASE_URL, task, config);
  }
  updateStatus(id, task) {
    return axios.put(`${TASK_API_BASE_URL}/${id}/status`, task, config);
  }
  deleteTask(id) {
    // Use axios.delete and handle boolean response from backend
    return axios.delete(`${TASK_API_BASE_URL}/${id}`, config)
      .then(response => response.data === true)
      .catch(() => false);
  }
}

export default new TaskService();