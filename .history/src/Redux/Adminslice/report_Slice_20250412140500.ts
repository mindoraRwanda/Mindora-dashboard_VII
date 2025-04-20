import axios from "axios";

export const getReport = async () => {
    const response = await axios.get({'https://mindora-backend-beta-version-m0bk.onrender.com/api/post-report/post/${postId}'),{}
        headers: {
        Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}