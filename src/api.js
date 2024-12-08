import axios from 'axios';

// Create an axios instance with default settings (e.g., base URL)
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Change this to your API's base URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

// Create: POST request to create a new resource
export const createItem = async (data) => {
  try {
    const response = await api.post('/items', data);
    return response.data;
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

// Read: GET request to fetch all resources
export const getItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Read: GET request to fetch a single resource by ID
export const getItem = async (id) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    throw error;
  }
};

// Update: PUT request to update an existing resource by ID
export const updateItem = async (id, data) => {
  try {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating item:', error);
    throw error;
  }
};

// Delete: DELETE request to delete a resource by ID
export const deleteItem = async (id) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};
// export const login = async (data) => {
//     try {
//       const response = await api.post('/users/login', data);
//       if (response.status === 200) {
//         const { access_token, username, email, role } = response.data;

//         if (access_token && username && email && role) {
//           login(access_token, { username, role, email });
//         } else {
//             console.log(response)
//         }
    
//       return response.data;
//     }
//     } catch (error) {
//       console.error('Error creating item:', error);
//       throw error;
//     }
//   };