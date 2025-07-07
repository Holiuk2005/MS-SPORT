// App State
const state = {
    dailyGoal: 2000,
    currentCalories: 0,
    currentProtein: 0,
    currentCarbs: 0,
    currentFat: 0,
    foodJournal: [],
    selectedFood: null,
    customFoods: [
        { id: 1, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { id: 2, name: "White Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
        { id: 3, name: "Broccoli", calories: 34, protein: 2.8, carbs: 6.6, fat: 0.4 },
        { id: 4, name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
        { id: 5, name: "Whole Wheat Bread", calories: 247, protein: 13, carbs: 41, fat: 3.4 }
    ],
    motivationMessages: [
        { id: 1, text: "Every small step counts! You're doing great!", minPercent: 0, maxPercent: 50 },
        { id: 2, text: "You're halfway there! Keep up the good work!", minPercent: 50, maxPercent: 75 },
        { id: 3, text: "You're 75% closer to your goal! Almost there!", minPercent: 75, maxPercent: 90 },
        { id: 4, text: "Amazing! You've reached your daily goal!", minPercent: 90, maxPercent: 100 },
        { id: 5, text: "You've exceeded your goal, but tomorrow is a new day!", minPercent: 100, maxPercent: 200 },
        { id: 6, text: "Consistency is key! This is your 3rd day tracking!", streak: 3 },
        { id: 7, text: "Believe in yourself! You can achieve your goals!", random: true },
        { id: 8, text: "Your efforts today are your results tomorrow!", random: true },
        { id: 9, text: "Small progress is still progress! Keep going!", random: true },
        { id: 10, text: "You're stronger than you think! Don't give up!", random: true }
    ],
    settings: {
        theme: 'light',
        motivationEnabled: true
    },
    streak: 0,
    lastAccessDate: null
};

// DOM Elements
const elements = {
    currentDate: document.getElementById('currentDate'),
    currentCalories: document.getElementById('currentCalories'),
    dailyGoal: document.getElementById('dailyGoal'),
    calorieProgress: document.getElementById('calorieProgress'),
    proteinCount: document.getElementById('proteinCount'),
    carbsCount: document.getElementById('carbsCount'),
    fatCount: document.getElementById('fatCount'),
    motivationBanner: document.getElementById('motivationBanner'),
    motivationText: document.getElementById('motivationText'),
    closeMotivation: document.getElementById('closeMotivation'),
    foodSearch: document.getElementById('foodSearch'),
    searchFood: document.getElementById('searchFood'),
    searchResults: document.getElementById('searchResults'),
    customFoodForm: document.getElementById('customFoodForm'),
    showCustomForm: document.getElementById('showCustomForm'),
    cancelCustomFood: document.getElementById('cancelCustomFood'),
    addCustomFood: document.getElementById('addCustomFood'),
    foodName: document.getElementById('foodName'),
    foodCalories: document.getElementById('foodCalories'),
    foodProtein: document.getElementById('foodProtein'),
    foodCarbs: document.getElementById('foodCarbs'),
    foodFat: document.getElementById('foodFat'),
    selectedFoodSection: document.getElementById('selectedFoodSection'),
    selectedFoodName: document.getElementById('selectedFoodName'),
    foodAmount: document.getElementById('foodAmount'),
    mealTime: document.getElementById('mealTime'),
    addToJournal: document.getElementById('addToJournal'),
    foodJournal: document.getElementById('foodJournal'),
    emptyJournalMessage: document.getElementById('emptyJournalMessage'),
    clearJournal: document.getElementById('clearJournal'),
    filterAll: document.getElementById('filterAll'),
    filterBreakfast: document.getElementById('filterBreakfast'),
    filterLunch: document.getElementById('filterLunch'),
    filterDinner: document.getElementById('filterDinner'),
    filterSnacks: document.getElementById('filterSnacks'),
    settingsModal: document.getElementById('settingsModal'),
    closeSettings: document.getElementById('closeSettings'),
    settingsBtn: document.getElementById('settingsBtn'),
    calorieGoalInput: document.getElementById('calorieGoalInput'),
    enableMotivation: document.getElementById('enableMotivation'),
    saveSettings: document.getElementById('saveSettings'),
    themeToggle: document.getElementById('themeToggle'),
    addFoodBtn: document.getElementById('addFoodBtn'),
    installContainer: document.getElementById('installContainer'),
    installButton: document.getElementById('installButton'),
    installCancel: document.getElementById('installCancel'),
    body: document.body
};

// Initialize the app
function init() {
    loadState();
    updateDate();
    updateProgress();
    renderFoodJournal();
    setupEventListeners();
    checkStreak();
    showMotivationMessage();
    
    // Check if PWA is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        elements.installContainer.classList.add('hidden');
    } else {
        // Show install prompt for mobile devices
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setTimeout(() => {
                elements.installContainer.classList.remove('hidden');
            }, 5000);
        }
    }
}

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('calorieMotivatorState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        Object.assign(state, parsedState);
        
        // Update UI with loaded state
        elements.dailyGoal.textContent = state.dailyGoal;
        elements.calorieGoalInput.value = state.dailyGoal;
        elements.enableMotivation.checked = state.settings.motivationEnabled;
        
        // Apply theme
        applyTheme(state.settings.theme);
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('calorieMotivatorState', JSON.stringify(state));
}

// Update current date display
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    elements.currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Update progress bars and counts
function updateProgress() {
    elements.currentCalories.textContent = state.currentCalories;
    elements.proteinCount.textContent = `${state.currentProtein}g`;
    elements.carbsCount.textContent = `${state.currentCarbs}g`;
    elements.fatCount.textContent = `${state.currentFat}g`;
    
    const percentage = Math.min((state.currentCalories / state.dailyGoal) * 100, 100);
    elements.calorieProgress.style.width = `${percentage}%`;
    
    // Change progress bar color based on percentage
    if (percentage < 50) {
        elements.calorieProgress.style.background = '#4ade80'; // green
    } else if (percentage < 75) {
        elements.calorieProgress.style.background = '#3b82f6'; // blue
    } else if (percentage < 90) {
        elements.calorieProgress.style.background = '#f59e0b'; // orange
    } else {
        elements.calorieProgress.style.background = '#ef4444'; // red
    }
}

// Render food journal
function renderFoodJournal(filter = 'all') {
    elements.foodJournal.innerHTML = '';
    
    const filteredItems = filter === 'all' 
        ? state.foodJournal 
        : state.foodJournal.filter(item => item.mealTime === filter);
    
    if (filteredItems.length === 0) {
        elements.emptyJournalMessage.classList.remove('hidden');
        return;
    }
    
    elements.emptyJournalMessage.classList.add('hidden');
    
    // Group by meal time
    const grouped = {};
    filteredItems.forEach(item => {
        if (!grouped[item.mealTime]) {
            grouped[item.mealTime] = [];
        }
        grouped[item.mealTime].push(item);
    });
    
    // Render each group
    for (const mealTime in grouped) {
        const group = grouped[mealTime];
        
        // Meal time header
        const mealHeader = document.createElement('div');
        mealHeader.className = 'flex items-center mb-2 mt-4';
        mealHeader.innerHTML = `
            <h3 class="font-medium capitalize dark:text-gray-300">${mealTime}</h3>
            <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">${group.reduce((sum, item) => sum + item.calories, 0)} kcal</span>
        `;
        elements.foodJournal.appendChild(mealHeader);
        
        // Food items
        group.forEach(item => {
            const foodItem = document.createElement('div');
            foodItem.className = 'food-item grid grid-cols-3 gap-2 items-center p-3 bg-gray-50 rounded-lg mb-2 dark:bg-gray-700/50';
            foodItem.innerHTML = `
                <div class="col-span-2">
                    <div class="font-medium dark:text-gray-300">${item.name}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">${item.amount}g • ${item.calories} kcal</div>
                </div>
                <div class="text-right">
                    <button class="delete-food p-2 text-red-500 hover:text-red-700 dark:text-red-400" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            elements.foodJournal.appendChild(foodItem);
        });
    }
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-food').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteFoodItem(id);
        });
    });
}

// Search for food
function searchFood() {
    const query = elements.foodSearch.value.trim().toLowerCase();
    if (!query) return;
    
    // Filter custom foods
    const results = state.customFoods.filter(food => 
        food.name.toLowerCase().includes(query)
    );
    
    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = elements.searchResults.querySelector('div');
    resultsContainer.innerHTML = '';
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="p-3 text-center text-gray-500 dark:text-gray-400">No results found</div>';
        elements.searchResults.classList.remove('hidden');
        return;
    }
    
    results.forEach(food => {
        const item = document.createElement('div');
        item.className = 'p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer dark:border-gray-700 dark:hover:bg-gray-700/50';
        item.innerHTML = `
            <div class="font-medium dark:text-gray-300">${food.name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${food.calories} kcal per 100g • P:${food.protein}g C:${food.carbs}g F:${food.fat}g</div>
        `;
        item.addEventListener('click', () => selectFood(food));
        resultsContainer.appendChild(item);
    });
    
    // Add option to create custom food
    const customOption = document.createElement('div');
    customOption.className = 'p-3 border-b border-gray-200 hover:bg-gray-100 cursor-pointer text-blue-500 font-medium dark:border-gray-700 dark:hover:bg-gray-700/50 dark:text-blue-400';
    customOption.innerHTML = '<i class="fas fa-plus mr-2"></i> Add custom food';
    customOption.addEventListener('click', showCustomFoodForm);
    resultsContainer.appendChild(customOption);
    
    elements.searchResults.classList.remove('hidden');
}

// Select a food item
function selectFood(food) {
    state.selectedFood = food;
    elements.selectedFoodName.textContent = food.name;
    elements.foodAmount.value = '100';
    elements.searchResults.classList.add('hidden');
    elements.customFoodForm.classList.add('hidden');
    elements.selectedFoodSection.classList.remove('hidden');
    elements.foodSearch.value = '';
}

// Show custom food form
function showCustomFoodForm() {
    elements.searchResults.classList.add('hidden');
    elements.customFoodForm.classList.remove('hidden');
    elements.selectedFoodSection.classList.add('hidden');
    elements.foodName.value = '';
    elements.foodCalories.value = '';
    elements.foodProtein.value = '0';
    elements.foodCarbs.value = '0';
    elements.foodFat.value = '0';
    elements.foodSearch.value = '';
}

// Hide custom food form
function hideCustomFoodForm() {
    elements.customFoodForm.classList.add('hidden');
    state.selectedFood = null;
}

// Add custom food
function addCustomFood() {
    const name = elements.foodName.value.trim();
    const calories = parseInt(elements.foodCalories.value);
    const protein = parseInt(elements.foodProtein.value);
    const carbs = parseInt(elements.foodCarbs.value);
    const fat = parseInt(elements.foodFat.value);
    
    if (!name || isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
        alert('Please fill all fields with valid numbers');
        return;
    }
    
    if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
        alert('Values cannot be negative');
        return;
    }
    
    const newFood = {
        id: state.customFoods.length > 0 ? Math.max(...state.customFoods.map(f => f.id)) + 1 : 1,
        name,
        calories,
        protein,
        carbs,
        fat
    };
    
    state.customFoods.push(newFood);
    selectFood(newFood);
    saveState();
}

// Add food to journal
function addFoodToJournal() {
    if (!state.selectedFood) return;
    
    const amount = parseInt(elements.foodAmount.value);
    const mealTime = elements.mealTime.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    // Calculate nutrition based on amount
    const ratio = amount / 100;
    const calories = Math.round(state.selectedFood.calories * ratio);
    const protein = Math.round(state.selectedFood.protein * ratio);
    const carbs = Math.round(state.selectedFood.carbs * ratio);
    const fat = Math.round(state.selectedFood.fat * ratio);
    
    const foodItem = {
        id: Date.now(),
        name: state.selectedFood.name,
        amount,
        calories,
        protein,
        carbs,
        fat,
        mealTime,
        timestamp: new Date().toISOString()
    };
    
    state.foodJournal.push(foodItem);
    state.currentCalories += calories;
    state.currentProtein += protein;
    state.currentCarbs += carbs;
    state.currentFat += fat;
    
    // Reset form
    state.selectedFood = null;
    elements.selectedFoodSection.classList.add('hidden');
    
    // Update UI
    updateProgress();
    renderFoodJournal();
    saveState();
    showMotivationMessage();
}

// Delete food item
function deleteFoodItem(id) {
    const index = state.foodJournal.findIndex(item => item.id === id);
    if (index === -1) return;
    
    const item = state.foodJournal[index];
    state.currentCalories -= item.calories;
    state.currentProtein -= item.protein;
    state.currentCarbs -= item.carbs;
    state.currentFat -= item.fat;
    
    state.foodJournal.splice(index, 1);
    
    updateProgress();
    renderFoodJournal();
    saveState();
    showMotivationMessage();
}

// Clear journal
function clearJournal() {
    if (!confirm('Are you sure you want to clear your food journal for today?')) return;
    
    state.foodJournal = [];
    state.currentCalories = 0;
    state.currentProtein = 0;
    state.currentCarbs = 0;
    state.currentFat = 0;
    
    updateProgress();
    renderFoodJournal();
    saveState();
    showMotivationMessage();
}

// Check user streak
function checkStreak() {
    const today = new Date().toDateString();
    
    if (state.lastAccessDate) {
        const lastAccess = new Date(state.lastAccessDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastAccess.toDateString() === yesterday.toDateString()) {
            state.streak += 1;
        } else if (lastAccess.toDateString() !== today) {
            state.streak = 1;
        }
    } else {
        state.streak = 1;
    }
    
    state.lastAccessDate = today;
    saveState();
}

// Show motivational message
function showMotivationMessage() {
    if (!state.settings.motivationEnabled) {
        elements.motivationBanner.classList.add('hidden');
        return;
    }
    
    const percentage = (state.currentCalories / state.dailyGoal) * 100;
    
    // Find appropriate messages
    const percentageMessages = state.motivationMessages.filter(m => 
        m.minPercent !== undefined && 
        percentage >= m.minPercent && 
        percentage < m.maxPercent
    );
    
    const streakMessages = state.streak >= 3 ? 
        state.motivationMessages.filter(m => m.streak && state.streak >= m.streak) : [];
    
    const randomMessages = state.motivationMessages.filter(m => m.random);
    
    // Combine all possible messages
    const possibleMessages = [...percentageMessages, ...streakMessages, ...randomMessages];
    
    if (possibleMessages.length === 0) {
        elements.motivationBanner.classList.add('hidden');
        return;
    }
    
    // Select random message
    const randomIndex = Math.floor(Math.random() * possibleMessages.length);
    elements.motivationText.textContent = possibleMessages[randomIndex].text;
    
    // Show with animation
    elements.motivationBanner.classList.remove('hidden');
    elements.motivationBanner.classList.add('fade-in');
}

// Open settings modal
function openSettings() {
    elements.settingsModal.classList.remove('hidden');
}

// Close settings modal
function closeSettings() {
    elements.settingsModal.classList.add('hidden');
}

// Save settings
function saveSettings() {
    const newGoal = parseInt(elements.calorieGoalInput.value);
    if (!isNaN(newGoal) && newGoal > 0) {
        state.dailyGoal = newGoal;
        elements.dailyGoal.textContent = newGoal;
        updateProgress();
    }
    
    state.settings.motivationEnabled = elements.enableMotivation.checked;
    
    saveState();
    closeSettings();
    
    if (state.settings.motivationEnabled) {
        showMotivationMessage();
    } else {
        elements.motivationBanner.classList.add('hidden');
    }
}

// Toggle theme
function toggleTheme() {
    const newTheme = state.settings.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    state.settings.theme = newTheme;
    saveState();
}

// Apply theme
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        elements.themeToggle.innerHTML = '<i class="fas fa-sun text-yellow-300"></i>';
    } else {
        document.documentElement.classList.remove('dark');
        elements.themeToggle.innerHTML = '<i class="fas fa-moon text-gray-600"></i>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Food search
    elements.searchFood.addEventListener('click', searchFood);
    elements.foodSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchFood();
    });
    
    // Custom food form
    elements.showCustomForm.addEventListener('click', showCustomFoodForm);
    elements.cancelCustomFood.addEventListener('click', hideCustomFoodForm);
    elements.addCustomFood.addEventListener('click', addCustomFood);
    
    // Add to journal
    elements.addToJournal.addEventListener('click', addFoodToJournal);
    
    // Journal management
    elements.clearJournal.addEventListener('click', clearJournal);
    
    // Filter buttons
    elements.filterAll.addEventListener('click', () => renderFoodJournal('all'));
    elements.filterBreakfast.addEventListener('click', () => renderFoodJournal('breakfast'));
    elements.filterLunch.addEventListener('click', () => renderFoodJournal('lunch'));
    elements.filterDinner.addEventListener('click', () => renderFoodJournal('dinner'));
    elements.filterSnacks.addEventListener('click', () => renderFoodJournal('snack'));
    
    // Motivation banner
    elements.closeMotivation.addEventListener('click', () => {
        elements.motivationBanner.classList.add('hidden');
    });
    
    // Settings
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettings.addEventListener('click', closeSettings);
    elements.saveSettings.addEventListener('click', saveSettings);
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Theme buttons in modal
    document.querySelectorAll('[data-theme]').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            applyTheme(theme);
            state.settings.theme = theme;
        });
    });
    
    // Add food button
    elements.addFoodBtn.addEventListener('click', () => {
        window.scrollTo({
            top: elements.foodSearch.offsetTop - 20,
            behavior: 'smooth'
        });
        elements.foodSearch.focus();
    });
    
    // Click outside search results to close them
    document.addEventListener('click', (e) => {
        if (!elements.searchResults.contains(e.target) && 
            e.target !== elements.foodSearch && 
            e.target !== elements.searchFood) {
            elements.searchResults.classList.add('hidden');
        }
    });
    
    // PWA installation
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        elements.installContainer.classList.remove('hidden');
    });
    
    elements.installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                elements.installContainer.classList.add('hidden');
            }
            deferredPrompt = null;
        }
    });
    
    elements.installCancel.addEventListener('click', () => {
        elements.installContainer.classList.add('hidden');
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}