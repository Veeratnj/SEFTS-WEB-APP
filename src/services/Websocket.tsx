export const websocket_api_call = (url: string, clientId: string, tokens: string[], onMessage: (data: any) => void) => {
  const socket = new WebSocket(url); // No query parameters in the URL

  socket.onopen = () => {
    console.log('WebSocket connection established');
    // Send the initial JSON payload with client_id and tokens
    const payload = {
      client_id: clientId,
      tokens: tokens,
    };
    socket.send(JSON.stringify(payload));
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data); // Parse the incoming message
      onMessage(data); // Pass the parsed data to the callback
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return socket;
};