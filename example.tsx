import { useEffect } from 'react';
import './App.css';
import get_api_call from './src/services/GetAPI';
import post_api_call from './src/services/PostAPI';
import put_api_call from './src/services/PutAPI';
import { websocket_api_call } from './src/services/Websocket';

function App() {
  //get api example
  useEffect(() => {
    // Define an async function inside useEffect
    const fetchData = async () => {
      try {
        const data = await get_api_call('http://127.0.0.1:8000/common/test');
        console.log(data); // You can use the data here (e.g., set state or update DOM)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function
  }, []); // Empty dependency array ensures this runs only once on component mount



  useEffect(() => {
    const sendData = async () => {
      try {
        const result = await post_api_call(
          'http://127.0.0.1:8000/common/test', // Base URL
        );
        console.log(result)
      } catch (error) {
        // console.log(error)
        console.error(error);
      }
    };

    sendData();
  }, []);


  useEffect(() => {
    const updateData = async () => {
      try {
        const result = await put_api_call(
          'http://127.0.0.1:8000/common/test' // Base URL
          
        );
        console.log(result)
      } catch (error) {
        console.error(error); // Handle the error
      }
    };

    updateData();
  }, []);


  useEffect(() => {
    const socket = websocket_api_call(
      'ws://127.0.0.1:8000/websockets/ws', // WebSocket URL (matching FastAPI)
      'Hello, WebSocket Server!', // Message to send on open
      (message: string) => {
        console.log(message); // Log message received from server
      }
    );

    // Cleanup: close WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []); 




  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
}

export default App;
