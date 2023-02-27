import React, { FunctionComponent } from 'react';

interface ProgressProps {
    percentage: number;
    label?: string;
    color?: string;
}

const Progress: FunctionComponent<ProgressProps> = ({
    percentage,
    label = '',
    color = 'var(--success)',
}) => {
    const progressBarStyle = {
        width: `${percentage}%`,
        backgroundColor: percentage >= 99.3 ? 'var(--error)' : color,
    };

    return (

        <div className="progress">
            <div className="progress-bar" style={progressBarStyle} />
            {label && <span className="progress-label">{label}</span>}
        </div>
    );
};

export default Progress;
