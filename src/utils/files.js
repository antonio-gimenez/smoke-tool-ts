import api from "../services/use-axios";

export const getFile = async (id) => {
  const { data } = await api
    .get(`files/?id=${id}`)
    .then((response) => response)
    .catch((error) => error);
  return data;
};
