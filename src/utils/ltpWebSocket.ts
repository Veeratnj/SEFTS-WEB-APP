// utils/ltpWebSocket.ts
type Ltp = { token: string; ltp: number };
type LtpCallback = (ltps: Ltp[]) => void;

export function get_ltp(tokens: string[], onLtpUpdate: LtpCallback) {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const url = `${baseUrl.replace(/^http/, 'ws')}/websocket/ws/stocks`;

  const userData = localStorage.getItem('userData');
  const { user_id: client_id } = userData ? JSON.parse(userData) : { user_id: null };

  if (!client_id || tokens.length === 0) return;

  const ws = new WebSocket(url);

  ws.onopen = () => {
    ws.send(JSON.stringify({ client_id, tokens }));
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const livePrices = data.live_prices as Ltp[];
      onLtpUpdate(livePrices);
    } catch (err) {
      console.error('WebSocket message parse error:', err);
    }
  };

  ws.onerror = (e) => console.error('WebSocket error:', e);
  ws.onclose = () => console.log('WebSocket closed');

  return ws;
}
