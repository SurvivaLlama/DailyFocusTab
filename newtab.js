document.addEventListener('DOMContentLoaded', function() {
    var setFocusButton = document.getElementById('setFocusButton');
    var newFocusInput = document.getElementById('newFocusInput');
    var focusText = document.getElementById('focusText');
    var focusCheckbox = document.getElementById('focusCheckbox');

    newFocusInput.focus();

    function celebrateCompletion() {
        // Celebration logic (e.g., change background color, display a message, etc.)
        alert('Congratulations on completing your task!'); // Example celebration
    }

    function resetFocus() {
        focusText.style.display = 'block';
        focusText.textContent = 'No daily focus set for today.';
        newFocusInput.value = '';
        focusCheckbox.checked = false;
    }

    setFocusButton.addEventListener('click', function() {
        chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
            updateFocusDisplay();
            resetFocus();
        });
    });

    newFocusInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
                updateFocusDisplay();
                resetFocus();
            });
        }
    });

    focusCheckbox.addEventListener('click', function() {
        if (focusCheckbox.checked) {
            focusText.style.display = 'none';
            celebrateCompletion();
            chrome.storage.local.set({ 'dailyFocus': '' });
        }
    });

    function updateFocusDisplay() {
        chrome.storage.local.get('dailyFocus', function(data) {
            focusText.textContent = data.dailyFocus || 'No daily focus set for today.';
        });
    }

    updateFocusDisplay();
});
