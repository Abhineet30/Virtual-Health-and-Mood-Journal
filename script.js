const moodButtons = document.querySelectorAll('.emoji-btn');
const saveEntryBtn = document.getElementById('save-entry');
const wellnessTipsDiv = document.getElementById('wellness-tips');

let selectedMood = null;

// Load saved mood selection if any
function loadSelectedMood() {
  const savedMood = localStorage.getItem('selectedMood');
  if (savedMood) {
    selectedMood = savedMood;
    moodButtons.forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.mood === savedMood);
    });
  }
}

// Handle mood button click
moodButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectedMood = button.dataset.mood;
    moodButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    localStorage.setItem('selectedMood', selectedMood);
  });
});

// Save today's entry to localStorage
function saveEntry() {
  if (!selectedMood) {
    alert('Please select a mood before saving.');
    return;
  }

  const sleepHours = parseFloat(document.getElementById('sleep-hours').value) || 0;
  const exerciseMinutes = parseInt(document.getElementById('exercise-minutes').value) || 0;
  const waterGlasses = parseInt(document.getElementById('water-glasses').value) || 0;

  const today = new Date().toISOString().split('T')[0];

  let entries = JSON.parse(localStorage.getItem('healthMoodEntries') || '[]');

  // Remove existing entry for today if any
  entries = entries.filter(entry => entry.date !== today);

  // Add new entry
  entries.push({
    date: today,
    mood: selectedMood,
    sleepHours,
    exerciseMinutes,
    waterGlasses
  });

  // Keep only last 7 days
  entries = entries.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);

  localStorage.setItem('healthMoodEntries', JSON.stringify(entries));

  alert('Entry saved successfully!');

  generateWellnessTips(entries);
}

// Generate AI wellness tips based on mood patterns
function generateWellnessTips(entries) {
  if (entries.length < 7) {
    wellnessTipsDiv.innerHTML = '<p>Save 7 days of entries to get personalized wellness tips.</p>';
    return;
  }

  // Simple heuristic for demo: count moods and habits averages
  const moodCounts = {};
  let totalSleep = 0;
  let totalExercise = 0;
  let totalWater = 0;

  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    totalSleep += entry.sleepHours;
    totalExercise += entry.exerciseMinutes;
    totalWater += entry.waterGlasses;
  });

  const avgSleep = (totalSleep / entries.length).toFixed(1);
  const avgExercise = (totalExercise / entries.length).toFixed(0);
  const avgWater = (totalWater / entries.length).toFixed(0);

  // Determine predominant mood
  let predominantMood = null;
  let maxCount = 0;
  for (const mood in moodCounts) {
    if (moodCounts[mood] > maxCount) {
      maxCount = moodCounts[mood];
      predominantMood = mood;
    }
  }

  // Generate tips based on mood and habits
  let tips = '<ul>';

  if (predominantMood === 'sad' || predominantMood === 'angry') {
    tips += '<li>Consider mindfulness or meditation to improve mood.</li>';
  } else if (predominantMood === 'happy' || predominantMood === 'excited') {
    tips += '<li>Keep up the positive energy with regular social activities.</li>';
  } else {
    tips += '<li>Maintain a balanced routine for steady well-being.</li>';
  }

  if (avgSleep < 7) {
    tips += `<li>Try to increase your average sleep from ${avgSleep} hours to 7-8 hours.</li>`;
  } else {
    tips += `<li>Your average sleep of ${avgSleep} hours is good. Keep it up!</li>`;
  }

  if (avgExercise < 30) {
    tips += `<li>Increase your exercise to at least 30 minutes daily. Currently averaging ${avgExercise} minutes.</li>`;
  } else {
    tips += `<li>Great job maintaining an average of ${avgExercise} minutes of exercise daily.</li>`;
  }

  if (avgWater < 8) {
    tips += `<li>Drink more water. Aim for 8 glasses daily; currently averaging ${avgWater} glasses.</li>`;
  } else {
    tips += `<li>Your hydration is good with an average of ${avgWater} glasses daily.</li>`;
  }

  tips += '</ul>';

  wellnessTipsDiv.innerHTML = tips;
}

function simulateMultipleEntries() {
  const moods = ['happy', 'sad', 'angry', 'neutral', 'excited'];
  const entries = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    entries.push({
      date: dateString,
      mood: moods[Math.floor(Math.random() * moods.length)],
      sleepHours: (5 + Math.random() * 4).toFixed(1),
      exerciseMinutes: Math.floor(Math.random() * 60),
      waterGlasses: Math.floor(4 + Math.random() * 8)
    });
  }

  localStorage.setItem('healthMoodEntries', JSON.stringify(entries));
  console.log('Simulated 7 days of entries for testing.');
}

// Initialize app
function init() {
  loadSelectedMood();

  saveEntryBtn.addEventListener('click', saveEntry);

  // Uncomment the following line to simulate entries for testing
  // simulateMultipleEntries();

  // Load existing entries and generate tips if available
  const entries = JSON.parse(localStorage.getItem('healthMoodEntries') || '[]');
  generateWellnessTips(entries);
}

window.onload = init;
