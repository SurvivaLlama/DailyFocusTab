
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const setFocusArea = document.getElementById('setFocusArea');
    const activeFocusArea = document.getElementById('activeFocusArea');
    const setFocusButton = document.getElementById('setFocusButton');
    const newFocusInput = document.getElementById('newFocusInput');
    const focusText = document.getElementById('focusText');
    const focusCheckbox = document.getElementById('focusCheckbox');
    
    // Load dark mode preference
    chrome.storage.local.get('darkMode', function(data) {
        if (data.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }
    });
    
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        chrome.storage.local.set({ 'darkMode': isDarkMode });
    });

    function showSetFocusArea() {
        setFocusArea.style.display = 'block';
        activeFocusArea.style.display = 'none';
        newFocusInput.value = '';
        newFocusInput.focus();
    }

    function showActiveFocusArea(focus) {
        setFocusArea.style.display = 'none';
        activeFocusArea.style.display = 'flex';
        focusText.textContent = focus;
        focusCheckbox.checked = false;
    }

    function updateFocusDisplay() {
        chrome.storage.local.get('dailyFocus', function(data) {
            if (data.dailyFocus) {
                showActiveFocusArea(data.dailyFocus);
            } else {
                showSetFocusArea();
            }
        });
    }

    setFocusButton.addEventListener('click', function() {
        const focus = newFocusInput.value.trim();
        if (focus) {
            chrome.storage.local.set({ 'dailyFocus': focus }, updateFocusDisplay);
        }
    });

    newFocusInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const focus = newFocusInput.value.trim();
            if (focus) {
                chrome.storage.local.set({ 'dailyFocus': focus }, updateFocusDisplay);
            }
        }
    });

    let checkboxTimer;
    let progressTimeout;
    
    focusCheckbox.addEventListener('mousedown', function() {
        this.classList.add('completing');
        checkboxTimer = setTimeout(() => {
            const fireworks = document.getElementById('fireworks');
            fireworks.style.display = 'block';
            
            // Create many more firework elements
            for(let i = 0; i < 20; i++) {
                const newFirework = document.createElement('div');
                newFirework.className = i % 2 === 0 ? 'before' : 'after';
                newFirework.style.left = Math.random() * 100 + 'vw';
                newFirework.style.animationDelay = (Math.random() * 2) + 's';
                newFirework.style.backgroundColor = ['#f7b731', '#2d51a3', '#ff4757', '#7bed9f'][Math.floor(Math.random() * 4)];
                fireworks.appendChild(newFirework);
            }
            
            chrome.storage.local.set({ 'dailyFocus': '' }, updateFocusDisplay);
            
            setTimeout(() => {
                fireworks.style.display = 'none';
                fireworks.innerHTML = '<div class="before"></div><div class="after"></div>';
            }, 5000);
        }, 2000);
    });

    focusCheckbox.addEventListener('mouseup', function() {
        clearTimeout(checkboxTimer);
    });

    focusCheckbox.addEventListener('mouseleave', function() {
        clearTimeout(checkboxTimer);
    });

    updateFocusDisplay();
});
