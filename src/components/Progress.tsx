import { FunctionComponent } from 'react';

interface ProgressProps {
    percentage: number;
    label?: string;
    color?: string;
    isLoadingData?: boolean,
}

const Progress: FunctionComponent<ProgressProps> = ({
    percentage,
    label = '',
    color = 'var(--success)',
    isLoadingData = false,
}) => {
    const progressBarStyle = {
        width: `${percentage}%`,
        backgroundColor: percentage >= 90 ? 'var(--warning)' : color,
    };

    return (
        <div className={`progress ${isLoadingData ? 'striped' : ''}`}>
            <div className={`progress-bar ${isLoadingData ? 'striped' : ''}`} style={progressBarStyle} />
            {label ? <span className={"progress-label"}>{isLoadingData ? 'Loading...' : label}</span> : null}
        </div>
    );
};

export default Progress;
