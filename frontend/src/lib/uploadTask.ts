import client from "@/api/config";

export const uploadTask = async (file:File) => {
    const fd = new FormData();
    fd.append('file',file);
    const data = await client.post('/upload',fd,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data.data.url;
}