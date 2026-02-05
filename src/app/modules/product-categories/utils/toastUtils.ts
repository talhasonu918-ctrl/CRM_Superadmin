import toast from 'react-hot-toast';

export const showToast = (message: string, icon: string = '👏') => {
    toast(message, {
        icon: icon,
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
        },
    });
};
