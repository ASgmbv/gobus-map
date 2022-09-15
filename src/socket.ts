import { io } from "socket.io-client";

const URL = "http://18.216.111.140:3000";

const socket = io(URL, {
	auth: {
		jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Nywicm9sZSI6IlVTRVIiLCJpYXQiOjE2NjI0NjE1ODF9.e925S9z678YjqZfx4VyN5j0lopJhroB5_qIm2eDwmxk",
	},
});

export default socket;
