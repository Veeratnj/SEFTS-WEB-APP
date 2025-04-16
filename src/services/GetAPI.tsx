import axios, { AxiosRequestConfig } from 'axios';

// Function to call the GET API with optional parameters
const get_api_call = async (
  url: string, 
  path_param?: { [key: string]: string },  // Optional
  query_param?: { [key: string]: string }, // Optional
  header?: { [key: string]: string }       // Optional
) => {
  
  // Step 1: Build the URL with path and query parameters
  const buildUrl = (url: string, path_param?: { [key: string]: string }, query_param?: { [key: string]: string }) => {
    if (path_param) {
      Object.keys(path_param).forEach((key) => {
        url = url.replace(`:${key}`, path_param[key]);
      });
    }
    const queryStr = new URLSearchParams(query_param).toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
    return url;
  };

  // Step 2: Configure headers if any
  const config: AxiosRequestConfig = {
    headers: header,  // Optional headers
  };

  try {
    // Step 3: Call the GET API
    const response = await axios.get(buildUrl(url, path_param, query_param), config);
    return response.data; // Only return the response data
  } catch (error) {
    console.error('Error in GET API call:', error);
    throw error; // Throw the error so it can be handled by the caller
  }
};

export default get_api_call;

// Example Usage
// const apiUrl = 'https://api.example.com/users/:userId';
// const path_param = { userId: '123' };
// const query_param = { search: 'john', limit: '10' };
// const header = { Authorization: 'Bearer your-token' };

// // Calling with all optional parameters
// get_api_call(apiUrl, path_param, query_param, header)
//   .then((data) => {
//     console.log('Response Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// // Calling with just path_param
// get_api_call(apiUrl, path_param)
//   .then((data) => {
//     console.log('Response Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// // Calling with just query_param
// get_api_call(apiUrl, undefined, query_param)
//   .then((data) => {
//     console.log('Response Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

// // Calling with no optional parameters (only URL)
// get_api_call(apiUrl)
//   .then((data) => {
//     console.log('Response Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });


// Example Usage
// const apiUrl = 'https://api.example.com/users/:userId';
// const path_param = { userId: '123' };
// const query_param = { search: 'john', limit: '10' };
// const header = { Authorization: 'Bearer your-token' };

// get_api_call(apiUrl, path_param, query_param, header)
//   .then((data) => {
//     console.log('Response Data:', data);
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });
