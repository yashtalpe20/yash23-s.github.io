// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const navigateButtons = document.querySelectorAll('[data-navigate]');

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Navigate button clicks
    navigateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-navigate');
            
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            document.querySelector(`[data-section="${targetSection}"]`).classList.add('active');
            document.getElementById(targetSection).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Slider value updates
    const sliderUpdates = [
        { slider: 'cgpa', display: 'cgpaValue' },
        { slider: 'communication', display: 'communicationValue' },
        { slider: 'majorProjects', display: 'majorProjectsValue' },
        { slider: 'miniProjects', display: 'miniProjectsValue' },
        { slider: 'skills', display: 'skillsValue' },
        { slider: 'twelfth', display: 'twelfthValue' },
        { slider: 'tenth', display: 'tenthValue' }
    ];

    sliderUpdates.forEach(item => {
        const slider = document.getElementById(item.slider);
        const display = document.getElementById(item.display);
        if (slider && display) {
            slider.addEventListener('input', function() {
                display.textContent = this.value;
            });
        }
    });

    // Prediction form submission
    const predictionForm = document.getElementById('predictionForm');
    if (predictionForm) {
        predictionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculatePrediction();
        });
    }

    // Initialize charts
    initializeCharts();
});

// Prediction calculation
function calculatePrediction() {
    const cgpa = parseFloat(document.getElementById('cgpa').value);
    const communication = parseFloat(document.getElementById('communication').value);
    const majorProjects = parseInt(document.getElementById('majorProjects').value);
    const miniProjects = parseInt(document.getElementById('miniProjects').value);
    const skills = parseInt(document.getElementById('skills').value);
    const workshops = parseInt(document.getElementById('workshops').value);
    const twelfth = parseFloat(document.getElementById('twelfth').value);
    const tenth = parseFloat(document.getElementById('tenth').value);
    const backlogs = parseInt(document.getElementById('backlogs').value);
    const hackathon = document.getElementById('hackathon').checked ? 1 : 0;
    const internship = document.getElementById('internship').checked ? 1 : 0;

    let score = 0;
    
    // CGPA (max 25 points) - normalized from 5-10 scale
    score += ((cgpa - 5) / (10 - 5)) * 25;
    
    // Communication (max 15 points) - normalized from 0-10 scale
    score += (communication / 10) * 15;
    
    // Projects (max 15 points)
    score += Math.min(majorProjects * 4, 10);
    score += Math.min(miniProjects * 1.5, 5);
    
    // Skills (max 15 points) - normalized from 0-10 scale
    score += (skills / 10) * 15;
    
    // Workshops (max 10 points)
    score += Math.min(workshops * 3.33, 10);
    
    // 12th and 10th (max 10 points)
    score += ((twelfth - 55) / (90 - 55)) * 5;
    score += ((tenth - 57) / (88 - 57)) * 5;
    
    // Internship (max 10 points)
    score += internship * 10;
    
    // Hackathon (max 5 points)
    score += hackathon * 5;
    
    // Backlogs (penalty)
    score -= backlogs * 3;

    // Normalize to 0-100
    score = Math.max(0, Math.min(100, score));

    updatePredictionUI(score, {
        cgpa, communication, majorProjects, miniProjects, skills, 
        workshops, internship, hackathon, backlogs
    });
}

function updatePredictionUI(score, data) {
    const scoreText = document.getElementById('scoreText');
    const riskBadge = document.getElementById('riskBadge');
    const recommendationList = document.getElementById('recommendationList');
    const scoreCircle = document.querySelector('.score-circle');

    scoreText.textContent = Math.round(score) + '%';

    const gradientEnd = (score / 100) * 360;
    scoreCircle.style.background = `conic-gradient(
        from 0deg,
        #667eea 0deg,
        #764ba2 ${gradientEnd}deg,
        rgba(255, 255, 255, 0.1) ${gradientEnd}deg
    )`;

    let riskClass, riskText;
    if (score >= 70) {
        riskClass = 'high';
        riskText = 'High Placement Probability';
    } else if (score >= 40) {
        riskClass = 'medium';
        riskText = 'Moderate Placement Probability';
    } else {
        riskClass = 'low';
        riskText = 'Low Placement Probability';
    }
    
    riskBadge.className = 'risk-badge ' + riskClass;
    riskBadge.textContent = riskText;

    const recommendations = generateRecommendations(score, data);
    recommendationList.innerHTML = recommendations.map(rec => `<li>${rec}</li>`).join('');
}

function generateRecommendations(score, data) {
    const recommendations = [];

    if (data.cgpa < 7.5) {
        recommendations.push('Focus on improving your CGPA - aim for 7.5+ to significantly boost placement chances');
    }

    if (data.skills < 6) {
        recommendations.push('Develop more technical skills - target 6-8 diverse programming languages and tools');
    }

    if (data.internship === 0) {
        recommendations.push('Gain internship experience - it can increase placement probability by up to 70%');
    }

    if (data.communication < 6) {
        recommendations.push('Improve communication skills through practice, training, and mock interviews');
    }

    if (data.backlogs > 0) {
        recommendations.push('Clear all backlogs as soon as possible - they significantly impact placement chances');
    }

    if (data.majorProjects < 2) {
        recommendations.push('Work on more major projects to showcase your technical capabilities and problem-solving skills');
    }

    if (data.workshops < 2) {
        recommendations.push('Attend more workshops and obtain certifications to enhance your profile');
    }

    if (data.hackathon === 0) {
        recommendations.push('Participate in hackathons to demonstrate innovation and teamwork abilities');
    }

    if (recommendations.length === 0) {
        recommendations.push('Excellent profile! Continue maintaining your strong performance');
        recommendations.push('Focus on leadership roles and advanced technical projects');
        recommendations.push('Build your professional network through LinkedIn and industry events');
    }

    return recommendations;
}

// Initialize charts
function initializeCharts() {
    const featureCtx = document.getElementById('featureChart');
    if (featureCtx) {
        new Chart(featureCtx, {
            type: 'bar',
            data: {
                labels: ['CGPA', 'Skills', 'Internship', 'Communication', 'Projects', 'Backlogs'],
                datasets: [{
                    label: 'Importance Score',
                    data: [0.25, 0.20, 0.18, 0.15, 0.12, 0.10],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(79, 172, 254, 0.8)',
                        'rgba(0, 242, 254, 0.8)',
                        'rgba(245, 87, 108, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(240, 147, 251, 1)',
                        'rgba(79, 172, 254, 1)',
                        'rgba(0, 242, 254, 1)',
                        'rgba(245, 87, 108, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 0.3,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#a1a1aa'
                        }
                    }
                }
            }
        });
    }

    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Accuracy', 'Precision', 'Recall', 'F1-Score'],
                datasets: [{
                    data: [93.4, 91.2, 89.8, 90.5],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.8)',
                        'rgba(118, 75, 162, 0.8)',
                        'rgba(240, 147, 251, 0.8)',
                        'rgba(79, 172, 254, 0.8)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)',
                        'rgba(240, 147, 251, 1)',
                        'rgba(79, 172, 254, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a1a1aa',
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }
}
