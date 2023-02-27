import React, { FunctionComponent } from 'react';

interface ProgressProps {
    percentage: number;
    label?: string;
    color?: string;
}

const Progress: FunctionComponent<ProgressProps> = ({
    percentage,
    label = '',
    color = 'var(--accent)',
}) => {
    const progressBarStyle = {
        width: `${percentage}%`,
        backgroundColor: color,
    };

    return (

        <div className="progress">
            <div className="progress-bar" style={progressBarStyle} />
            {label && <span className="progress-label">{label}</span>}
        </div>
    );
};

export default Progress;
