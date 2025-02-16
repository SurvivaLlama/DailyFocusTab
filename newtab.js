
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

    focusCheckbox.addEventListener('change', function() {
        if (focusCheckbox.checked) {
            setTimeout(() => {
                chrome.storage.local.set({ 'dailyFocus': '' }, updateFocusDisplay);
            }, 1000);
        }
    });

    updateFocusDisplay();
});
