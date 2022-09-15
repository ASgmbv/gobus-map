import { useEffect, useState } from "react";
import {
	ComposableMap,
	Geographies,
	Geography,
	Marker,
} from "react-simple-maps";
import socket from "./socket";

const geoUrl =
	"https://raw.githubusercontent.com/deldersveld/topojson/master/countries/france/fr-departments.json";

// TODO do not connect automatically

const coordinates: [number, number][] = [
	[2.2768238, 48.8589465],

	[2.5401723, 48.8222162],

	[2.6300369, 48.8534388],

	[2.7697491, 48.8453363],

	[2.858957, 48.8982319],

	[2.9685557, 48.920646],

	[3.2584504, 48.9821681],
];

export default function MapChart() {
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [coord, setCoord] = useState(coordinates[0]);
	const [idx, setIndex] = useState(0);

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("share_location", (payload) => {
			console.log("share_location");
			setCoord([payload.lat, payload.ltd]);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		socket.on("connect_error", (error) => {
			console.log({ error });
		});

		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("connect_error");
		};
	}, []);

	const sendCreateRoom = () => {
		socket.emit("create_trip_room", { tripId: 123456 });
	};

	const sendJoinRoom = () => {
		socket.emit("join_trip_room", { tripId: 123456 });
	};

	const sendDestroyRoom = () => {
		socket.emit("destroy_trip_room", { tripId: 123456 });
	};

	const sendLocation = () => {
		setIndex((idx + 1) % coordinates.length);

		socket.emit("share_location", {
			tripId: 123456,
			lat: coordinates[idx][0],
			ltd: coordinates[idx][1],
		});
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				<p>Connected: {"" + isConnected}</p>
				<button onClick={sendCreateRoom}>Create</button>
				<button onClick={sendJoinRoom}>Join</button>
				<button onClick={sendDestroyRoom}>Destroy</button>
				<button onClick={sendLocation}>Share location</button>
			</div>
			<div
				style={{
					width: "600px",
					height: "600px",
					background: "gray",
				}}
			>
				<ComposableMap
					projection="geoEqualEarth"
					projectionConfig={{
						center: [2.3280866, 47.07813],
						scale: 3000,
					}}
				>
					<Geographies geography={geoUrl}>
						{({ geographies }) =>
							geographies.map((geo) => (
								<Geography key={geo.rsmKey} geography={geo} />
							))
						}
					</Geographies>
					<Marker coordinates={coord}>
						<circle r={4} fill="#F53" />
					</Marker>
				</ComposableMap>
			</div>
		</>
	);
}
