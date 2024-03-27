import apiClient from "../ultis/request";


export const loginService = async (path,data) => {
   var response =  await apiClient.post(path, data);
   return response;
}
