import axios from "axios";

export const getReport = async () => {
    const response = await axios.get("https://api.example.com/report", {
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}