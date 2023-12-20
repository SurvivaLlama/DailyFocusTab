document.addEventListener('DOMContentLoaded', function() {
    var setFocusButton = document.getElementById('setFocusButton');
    var newFocusInput = document.getElementById('newFocusInput');
    var focusText = document.getElementById('focusText');
    var focusCheckbox = document.getElementById('focusCheckbox'); // Grab the checkbox element

    newFocusInput.focus();

    setFocusButton.addEventListener('click', function() {
        chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
            updateFocusDisplay();
        });
    });

    newFocusInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            chrome.storage.local.set({ 'dailyFocus': newFocusInput.value }, function() {
                updateFocusDisplay();
            });
        }
    });

    focusCheckbox.addEventListener('click', function() {
        if (focusCheckbox.checked) {
            focusText.style.display = 'none';
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
