import { useMutation, useQueryClient } from '@tanstack/react-query';

import { restApi } from '@/configs/axios';

export const uploadFiles = async (formData: FormData) => {
    const { data, status } = await restApi.post('/api/uploads', formData);

    return {
        data,
        status,
    };
};

export const useUploadFiles = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: uploadFiles,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['images'] });
        },
        onError: (error) => {
            console.error('Error uploading files:', error);
        },
    });
};
