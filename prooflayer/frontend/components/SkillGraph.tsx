import React from 'react';
import { Bar } from 'react-chartjs-2';

const SkillGraph = ({ skills }) => {
    const data = {
        labels: skills.map(skill => skill.name),
        datasets: [
            {
                label: 'Skill Level',
                data: skills.map(skill => skill.level),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Skill Graph</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default SkillGraph;