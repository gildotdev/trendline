let currentProject = null;
let burndownChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('projectForm').addEventListener('submit', handleCreateProject);
    document.getElementById('loadForm').addEventListener('submit', handleLoadProject);
    document.getElementById('progressForm').addEventListener('submit', handleUpdateProgress);
    
    // Set today's date as default for progress form
    document.getElementById('progressDate').valueAsDate = new Date();
});

// View management
function showSetupView() {
    document.getElementById('setupView').classList.remove('hidden');
    document.getElementById('loadView').classList.add('hidden');
    document.getElementById('trackerView').classList.add('hidden');
    currentProject = null;
}

function showLoadView() {
    document.getElementById('setupView').classList.add('hidden');
    document.getElementById('loadView').classList.remove('hidden');
    document.getElementById('trackerView').classList.add('hidden');
}

function showTrackerView() {
    document.getElementById('setupView').classList.add('hidden');
    document.getElementById('loadView').classList.add('hidden');
    document.getElementById('trackerView').classList.remove('hidden');
}

// Message display
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.classList.remove('hidden');
    
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// Create project
async function handleCreateProject(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('projectId').value.trim();
    const totalTasks = parseInt(document.getElementById('totalTasks').value);
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (new Date(startDate) >= new Date(endDate)) {
        showMessage('End date must be after start date', 'error');
        return;
    }
    
    const projectData = {
        projectId,
        totalTasks,
        startDate,
        endDate,
        dailyProgress: {}
    };
    
    try {
        const response = await fetch('/api/project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        
        currentProject = projectData;
        showMessage('Project created successfully!', 'success');
        loadProject(currentProject);
    } catch (error) {
        showMessage('Error creating project: ' + error.message, 'error');
    }
}

// Load project
async function handleLoadProject(e) {
    e.preventDefault();
    
    const projectId = document.getElementById('loadProjectId').value.trim();
    
    try {
        const response = await fetch(`/api/project?id=${encodeURIComponent(projectId)}`);
        
        if (!response.ok) {
            throw new Error('Project not found');
        }
        
        const projectData = await response.json();
        currentProject = projectData;
        showMessage('Project loaded successfully!', 'success');
        loadProject(currentProject);
    } catch (error) {
        showMessage('Error loading project: ' + error.message, 'error');
    }
}

// Update daily progress
async function handleUpdateProgress(e) {
    e.preventDefault();
    
    const date = document.getElementById('progressDate').value;
    const tasksCompleted = parseInt(document.getElementById('tasksCompleted').value);
    
    if (!currentProject) return;
    
    // Validate date is within project timeline
    if (date < currentProject.startDate || date > currentProject.endDate) {
        showMessage('Date must be within project timeline', 'error');
        return;
    }
    
    // Validate date is not in the future
    const today = new Date().toISOString().split('T')[0];
    if (date > today) {
        showMessage('Cannot add progress for future dates', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: currentProject.projectId,
                date,
                tasksCompleted
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update progress');
        }
        
        // Update local data
        currentProject.dailyProgress[date] = tasksCompleted;
        showMessage('Progress updated!', 'success');
        
        // Reload the display
        loadProject(currentProject);
        
        // Reset form
        document.getElementById('tasksCompleted').value = '';
    } catch (error) {
        showMessage('Error updating progress: ' + error.message, 'error');
    }
}

// Load and display project
function loadProject(project) {
    currentProject = project;
    showTrackerView();
    
    document.getElementById('projectTitle').textContent = project.projectId;
    
    // Calculate statistics
    const totalCompleted = Object.values(project.dailyProgress || {}).reduce((sum, val) => sum + val, 0);
    const remaining = project.totalTasks - totalCompleted;
    
    document.getElementById('statTotal').textContent = project.totalTasks;
    document.getElementById('statCompleted').textContent = totalCompleted;
    document.getElementById('statRemaining').textContent = remaining;
    
    // Calculate status
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date(today);
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const daysPassed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    const expectedProgress = (daysPassed / totalDays) * project.totalTasks;
    const actualProgress = totalCompleted;
    
    const statusCard = document.getElementById('statusCard');
    const statusValue = document.getElementById('statStatus');
    
    statusCard.classList.remove('on-track', 'behind', 'ahead');
    
    if (actualProgress >= expectedProgress * 0.95) {
        if (actualProgress > expectedProgress * 1.05) {
            statusCard.classList.add('ahead');
            statusValue.textContent = 'Ahead';
        } else {
            statusCard.classList.add('on-track');
            statusValue.textContent = 'On Track';
        }
    } else {
        statusCard.classList.add('behind');
        statusValue.textContent = 'Behind';
    }
    
    // Render chart
    renderChart(project);
    
    // Render progress history
    renderProgressHistory(project);
}

// Render burndown chart
function renderChart(project) {
    const ctx = document.getElementById('burndownChart').getContext('2d');
    
    if (burndownChart) {
        burndownChart.destroy();
    }
    
    // Generate date range
    const dates = [];
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
    }
    
    // Calculate ideal burndown
    const idealData = dates.map((_, index) => {
        return project.totalTasks - (project.totalTasks / (dates.length - 1)) * index;
    });
    
    // Calculate actual progress
    let cumulativeCompleted = 0;
    const actualData = dates.map(date => {
        if (project.dailyProgress[date]) {
            cumulativeCompleted += project.dailyProgress[date];
        }
        const today = new Date().toISOString().split('T')[0];
        if (date > today) {
            return null; // Don't show future actual data
        }
        return project.totalTasks - cumulativeCompleted;
    });
    
    burndownChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Ideal Progress',
                    data: idealData,
                    borderColor: '#6b7280',
                    backgroundColor: 'rgba(107, 114, 128, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    tension: 0
                },
                {
                    label: 'Actual Progress',
                    data: actualData,
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Burndown Chart',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + Math.round(context.parsed.y) + ' tasks remaining';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tasks Remaining'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    },
                    ticks: {
                        maxTicksLimit: 10
                    }
                }
            }
        }
    });
}

// Render progress history
function renderProgressHistory(project) {
    const historyEl = document.getElementById('progressHistory');
    const progress = project.dailyProgress || {};
    
    if (Object.keys(progress).length === 0) {
        historyEl.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 20px;">No progress recorded yet</p>';
        return;
    }
    
    // Sort by date descending
    const sortedDates = Object.keys(progress).sort().reverse();
    
    historyEl.innerHTML = sortedDates.map(date => {
        const tasks = progress[date];
        return `
            <div class="progress-item">
                <span class="progress-item-date">${formatDate(date)}</span>
                <span class="progress-item-tasks">${tasks} task${tasks !== 1 ? 's' : ''}</span>
                <div class="progress-item-actions">
                    <button class="btn btn-secondary btn-small" onclick="editProgress('${date}', ${tasks})">Edit</button>
                </div>
            </div>
        `;
    }).join('');
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Edit progress
function editProgress(date, currentValue) {
    document.getElementById('progressDate').value = date;
    document.getElementById('tasksCompleted').value = currentValue;
    document.getElementById('tasksCompleted').focus();
}
