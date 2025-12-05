
/* ============================================
   DASHBOARD - USER DEMOGRAPHICS ANALYTICS
   ============================================ */

/* Initialize users data from localStorage */
function initializeUsersData() {
    var storedUsers = localStorage.getItem('studystayUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

/* Save users to localStorage */
function saveUsersData(users) {
    localStorage.setItem('studystayUsers', JSON.stringify(users));
}

/* Get gender distribution */
function getGenderDistribution() {
    var users = initializeUsersData();
    var distribution = {};
    
    users.forEach(function(user) {
        if (user.gender) {
            distribution[user.gender] = (distribution[user.gender] || 0) + 1;
        }
    });
    
    return distribution;
}

/* Get age group distribution */
function getAgeGroupDistribution() {
    var users = initializeUsersData();
    var distribution = {};
    
    users.forEach(function(user) {
        if (user.ageGroup) {
            distribution[user.ageGroup] = (distribution[user.ageGroup] || 0) + 1;
        }
    });
    
    return distribution;
}

/* Calculate percentage */
function calculatePercentage(count, total) {
    if (total === 0) return 0;
    return ((count / total) * 100).toFixed(2);
}

/* Get total users */
function getTotalUsers() {
    var users = initializeUsersData();
    return users.length;
}

/* Render gender data with percentages */
function renderGenderData() {
    var container = document.getElementById('genderData');
    if (!container) return;
    
    var genderDistribution = getGenderDistribution();
    var totalUsers = getTotalUsers();
    
    var html = '';
    
    if (totalUsers === 0) {
        html = '<p style="color: #999; text-align: center;">No user data available yet. Register to see statistics.</p>';
    } else {
        // Create array for consistent ordering
        var genderOrder = ['Male', 'Female', 'Other'];
        
        genderOrder.forEach(function(gender) {
            if (genderDistribution[gender] !== undefined) {
                var count = genderDistribution[gender];
                var percentage = calculatePercentage(count, totalUsers);
                
                html += '<div class="data-row">';
                html += '<span class="data-label">' + gender + '</span>';
                html += '<div style="display: flex; align-items: center; gap: 10px;">';
                html += '<span class="data-count">' + count + '</span>';
                html += '<span style="color: #666; font-weight: 500;">(' + percentage + '%)</span>';
                html += '</div>';
                html += '</div>';
            }
        });
        
        html += '<div class="total-row">';
        html += '<span>Total Users</span>';
        html += '<span>' + totalUsers + '</span>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    if (totalUsers > 0) {
        renderGenderChart(genderDistribution, totalUsers);
    }
}

/* Render age group data with percentages */
function renderAgeGroupData() {
    var container = document.getElementById('ageGroupData');
    if (!container) return;
    
    var ageDistribution = getAgeGroupDistribution();
    var totalUsers = getTotalUsers();
    
    var html = '';
    
    if (totalUsers === 0) {
        html = '<p style="color: #999; text-align: center;">No user data available yet. Register to see statistics.</p>';
    } else {
        // Sort age groups in correct order
        var ageOrder = ['18-22', '23-27', '28-32', '33+'];
        
        ageOrder.forEach(function(ageGroup) {
            if (ageDistribution[ageGroup] !== undefined) {
                var count = ageDistribution[ageGroup];
                var percentage = calculatePercentage(count, totalUsers);
                
                html += '<div class="data-row">';
                html += '<span class="data-label">' + ageGroup + '</span>';
                html += '<div style="display: flex; align-items: center; gap: 10px;">';
                html += '<span class="data-count">' + count + '</span>';
                html += '<span style="color: #666; font-weight: 500;">(' + percentage + '%)</span>';
                html += '</div>';
                html += '</div>';
            }
        });
        
        html += '<div class="total-row">';
        html += '<span>Total Users</span>';
        html += '<span>' + totalUsers + '</span>';
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    if (totalUsers > 0) {
        renderAgeChart(ageDistribution, totalUsers);
    }
}

/* Render gender bar chart with percentages */
function renderGenderChart(distribution, totalUsers) {
    var chartContainer = document.getElementById('genderChart');
    if (!chartContainer) return;
    
    var maxCount = Math.max.apply(Math, Object.values(distribution).length > 0 ? Object.values(distribution) : [1]);
    var genderOrder = ['Male', 'Female', 'Other'];
    
    var chartHTML = '';
    
    genderOrder.forEach(function(gender) {
        if (distribution[gender] !== undefined) {
            var count = distribution[gender];
            var percentage = calculatePercentage(count, totalUsers);
            var barPercentage = (count / maxCount) * 100;
            
            chartHTML += '<div class="bar">';
            chartHTML += '<div class="bar-fill" style="height: ' + barPercentage + '%;"></div>';
            chartHTML += '<span class="bar-label">' + gender + '<br>' + count + ' (' + percentage + '%)</span>';
            chartHTML += '</div>';
        }
    });
    
    chartContainer.innerHTML = chartHTML;
}

/* Render age group bar chart with percentages */
function renderAgeChart(distribution, totalUsers) {
    var chartContainer = document.getElementById('ageChart');
    if (!chartContainer) return;
    
    var maxCount = Math.max.apply(Math, Object.values(distribution).length > 0 ? Object.values(distribution) : [1]);
    var ageOrder = ['18-22', '23-27', '28-32', '33+'];
    
    var chartHTML = '';
    
    ageOrder.forEach(function(ageGroup) {
        if (distribution[ageGroup] !== undefined) {
            var count = distribution[ageGroup];
            var percentage = calculatePercentage(count, totalUsers);
            var barPercentage = (count / maxCount) * 100;
            
            chartHTML += '<div class="bar">';
            chartHTML += '<div class="bar-fill" style="height: ' + barPercentage + '%;"></div>';
            chartHTML += '<span class="bar-label">' + ageGroup + '<br>' + count + ' (' + percentage + '%)</span>';
            chartHTML += '</div>';
        }
    });
    
    chartContainer.innerHTML = chartHTML;
}

/* Refresh dashboard data (call this when data changes) */
function refreshDashboard() {
    renderGenderData();
    renderAgeGroupData();
}

/* Initialize on page load */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    renderGenderData();
    renderAgeGroupData();
});

/* Watch for storage changes (when new users register) */
window.addEventListener('storage', function(e) {
    if (e.key === 'studystayUsers') {
        console.log('User data changed, refreshing dashboard...');
        refreshDashboard();
    }
});

console.log('Dashboard.js loaded successfully');
