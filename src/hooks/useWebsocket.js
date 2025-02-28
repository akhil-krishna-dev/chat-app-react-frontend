import { useEffect, useState } from "react";

const useWebSocket = (URL) => {
	const [socket, setSocket] = useState(null);

	useEffect(() => {
		const newSocket = new WebSocket(URL);
		setSocket(newSocket);

		return () => {
			socket?.close();
		};
	}, [URL]);
	return socket;
};

export default useWebSocket;
