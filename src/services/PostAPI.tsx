import axios from 'axios';

const post_api_call = async (
  url: string,
  path_param?: string,
  query_param?: Record<string, string>,
  header?: Record<string, string>,
  payload?: object
) => {
  try {
    // Construct the full URL if path_param is provided
    let fullUrl = url;
    if (path_param) {
      fullUrl = `${url}/${path_param}`;
    }

    // Axios request configuration
    const config: any = {
      headers: header,
      params: query_param,
    };

    // Make the POST request with the provided payload
    const response = await axios.post(fullUrl, payload, config);

    // Return the response
    return response.data;
  } catch (error) {
    console.error('Error making POST request:', error);
    throw error; // Rethrow the error if needed
  }
};

export default post_api_call;
