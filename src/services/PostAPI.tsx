// import axios from 'axios';

// const post_api_call = async (
//   url: string,
//   path_param?: string,
//   query_param?: Record<string, string>,
//   header?: Record<string, string>,
//   payload?: object
// ) => {
//   try {
//     // Construct the full URL if path_param is provided
//     let fullUrl = url;
//     if (path_param) {
//       fullUrl = `${url}/${path_param}`;
//     }

//     // Axios request configuration
//     const config: any = {
//       headers: header,
//       params: query_param,
//     };

//     // Make the POST request with the provided payload
//     const response = await axios.post(fullUrl, payload, config);

//     // Return the response
//     return response.data;
//   } catch (error) {
//     console.error('Error making POST request:', error);
//     throw error; // Rethrow the error if needed
//   }
// };

// export default post_api_call;




import axios, { AxiosRequestConfig } from 'axios';

// Function to build the final URL with path and query parameters
const buildUrl = (
  url: string,
  path_param?: { [key: string]: string },
  query_param?: { [key: string]: string }
) => {
  // Replace path parameters like :id with actual values
  if (path_param) {
    Object.keys(path_param).forEach((key) => {
      url = url.replace(`:${key}`, path_param[key]);
    });
  }

  // Add query parameters if present
  const queryString = query_param ? new URLSearchParams(query_param).toString() : '';
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
};

// POST API function
const post_api_call = async (
  url: string,
  path_param?: { [key: string]: string },
  query_param?: { [key: string]: string },
  header?: { [key: string]: string },
  payload?: object
) => {
  try {
    const fullUrl = buildUrl(url, path_param, query_param);

    const config: AxiosRequestConfig = {
      headers: header,
    };

    const response = await axios.post(fullUrl, payload, config);
    return response.data; // return only the response data
  } catch (error) {
    console.error('Error making POST request:', error);
    throw error;
  }
};

export default post_api_call;
