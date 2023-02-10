import { useState, useEffect } from 'react';

function useDeviceType() {
    const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 767) {
                setDeviceType('mobile');
            } else if (window.innerWidth > 767 && window.innerWidth <= 1024) {
                setDeviceType('tablet');
            } else {
                setDeviceType('desktop');
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return deviceType;
}

export default useDeviceType;