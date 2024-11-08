import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function ViewFeedback(props) {
    const semester = localStorage.getItem('semester');
    const faculty = localStorage.getItem('faculty');
    const course = localStorage.getItem('course');
    const [feedback, setFeedback] = useState({});
    const chartRefs = useRef([]);

    const getFeedback = async () => {
        let data = await fetch("http://127.0.0.1:5000/getfeedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": localStorage.getItem('token')
            },
            body: `semester=${encodeURIComponent(semester)}&faculty=${encodeURIComponent(faculty)}&course=${encodeURIComponent(course)}`
        });
        if (data.status === 200) {
            data = await data.json();
            setFeedback(data.feedback);
        }
    };

    const aggregateCounts = (chartData) => {
        return {
            agree: (chartData["agree"] || 0) + (chartData["strongly_agree"] || 0),
            disagree: (chartData["disagree"] || 0) + (chartData["strongly_disagree"] || 0),
        };
    };

    useEffect(() => {
        if (localStorage.getItem('token')) {
            props.setLogged(true);
            props.setAdminSession(true);
        }

        getFeedback();
    //eslint-disable-next-line
    }, []);

    useEffect(() => {
        chartRefs.current.forEach(chart => chart?.destroy());
        chartRefs.current = [];
        
        Object.keys(feedback).forEach((question, index) => {
            const ctx = document.getElementById(`feedbackChart${index}`);
            const chartData = feedback[question];
            const { agree, disagree } = aggregateCounts(chartData);

            const newChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(chartData),
                    datasets: [{
                        label: `Agree: ${agree}, Disagree: ${disagree} ${agree >= disagree ? '✅' : '❌'}`,
                        data: Object.values(chartData),
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: question,
                            position: 'bottom',
                            font: { size: 16 }
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
            chartRefs.current.push(newChart);
        });
    }, [feedback]);

    return (
        <div id="viewFeedback" className="row">
            <h4>{faculty}</h4>
            <h4>{course}</h4>
            {Object.keys(feedback).map((question, index) => (
                <div key={index} className="col-4 my-4">
                    <canvas id={`feedbackChart${index}`} width="400" height="400"></canvas>
                </div>
            ))}
        </div>
    );
}

export default ViewFeedback;