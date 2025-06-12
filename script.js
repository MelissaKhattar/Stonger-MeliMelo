document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthYearDisplay = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const workoutDetails = document.getElementById('workoutDetails');

    // New DOM Elements for view management
    const mainAppContainer = document.getElementById('app-container');
    const workoutSessionContainer = document.getElementById('workoutSessionContainer');
    const sessionWorkoutTitle = document.getElementById('sessionWorkoutTitle');
    const currentExerciseDisplay = document.getElementById('currentExerciseDisplay');
    const backToCalendarBtn = document.getElementById('backToCalendarBtn');
    const finishWorkoutBtn = document.getElementById('finishWorkoutBtn');

    // New DOM Elements for exercise navigation and timer
    const prevExerciseBtn = document.getElementById('prevExerciseBtn');
    const nextExerciseBtn = document.getElementById('nextExerciseBtn');
    const restTimerDisplay = document.getElementById('restTimerDisplay');
    const startTimerBtn = document.getElementById('startTimerBtn');

    // State Variables
    let currentDate = new Date(); // Represents the month/year currently displayed on the calendar
    let currentSelectedDate = null; // Stores the date string for the currently selected day
    let currentWorkoutPlan = null; // Stores the detailed plan for the active workout day
    let currentExerciseIndex = 0; // Tracks which exercise is currently displayed in the session

    // Timer Variables
    let timerInterval = null;
    let timeLeft = 0;
    const defaultRestTime = 60; // seconds

    // --- Your 4-Week Workout Plan Data ---
    // This defines the structure and content of your workouts
    const workoutPlan = {
        'Week 1': {
            'Day 1': {
                title: 'Week 1: Full Body Strength & Posture',
                exercises: [
                    { name: 'Leg Press Machine', sets: '3', reps: '10-12', description: 'Focus: drive through heels, knees align with toes.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-press.png' },
                    { name: 'Seated Cable Row', sets: '3', reps: '10-12', description: 'Focus: pull with your back, squeeze shoulder blades together, chest up. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-cable-row.png' },
                    { name: 'Machine Chest Press', sets: '3', reps: '10-12', description: 'Focus: Keep elbows slightly tucked, control the movement, stop before lockout if shoulder sensitive. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/machine-chest-press.png' },
                    { name: 'Hamstring Curl Machine', sets: '3', reps: '12-15', description: 'Focus: slow and controlled curl.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hamstring-curl.png' },
                    { name: 'Leg Extension Machine', sets: '3', reps: '12-15', description: 'Focus: controlled extension, slight pause at top.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-extension.png' },
                    { name: 'Face Pulls (Cable Machine)', sets: '3', reps: '15-20', description: 'Focus: excellent for shoulder health and posture. Pull cable towards your face, elbows high, squeeze shoulder blades.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/face-pull.png' },
                    { name: 'Plank', sets: '3', reps: '30-45 sec', description: 'Focus: straight line from head to heels, engage core.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/plank.png' }
                ]
            },
            'Day 2': {
                title: 'Week 1: Upper Body & Core (Shoulder Careful) & Mobility',
                exercises: [
                    { name: 'Lat Pulldown Machine', sets: '3', reps: '10-12', description: 'Focus: pull bar to upper chest, chest up, engage lats.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lat-pulldown.png' },
                    { name: 'Machine Incline Chest Press', sets: '3', reps: '10-12', description: 'Focus: Maintain control, slightly less shoulder involvement than flat. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/incline-press.png' },
                    { name: 'Machine Reverse Fly (Rear Delt Machine)', sets: '3', reps: '15-20', description: 'Focus: target rear shoulders and upper back. Use light weight, controlled movement.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/reverse-fly.png' },
                    { name: 'Single Arm Cable Row (Seated)', sets: '3', reps: '10-12 per arm', description: 'Focus: stable core, pull with back. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/single-arm-cable-row.png' },
                    { name: 'Machine Lateral Raises (Very Light Weight)', sets: '3', reps: '15-20', description: 'Focus: Use extremely light weight, feel it in the side of your shoulder, avoid shrugging. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lateral-raise.png' },
                    { name: 'Cable Crunches', sets: '3', reps: '15-20', description: 'Focus: engage abs, not just hip flexors.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/cable-crunch.png' },
                    { name: 'Bird-Dog', sets: '3', reps: '10-12 per side', description: 'Focus: core stability, slow and controlled.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/bird-dog.png' }
                ]
            },
            'Day 3': {
                title: 'Week 1: Lower Body, Posterior Chain & Posture',
                exercises: [
                    { name: 'Goblet Squat (with dumbbell) or Hack Squat Machine', sets: '3', reps: '10-12', description: 'Focus: deep squat, chest up, core engaged.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/goblet-squat.png' },
                    { name: 'Glute Bridge (bodyweight or with plate on hips)', sets: '3', reps: '12-15', description: 'Focus: squeeze glutes at the top.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/glute-bridge.png' },
                    { name: 'Assisted Pull-up Machine (or Lat Pulldown if no machine)', sets: '3', reps: '8-12', description: 'Focus: engage back, pull up, control descent. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/assisted-pull-up.png' },
                    { name: 'Seated Calf Raise Machine', sets: '3', reps: '15-20', description: 'Focus: full range of motion, squeeze calves.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-calf-raise.png' },
                    { name: 'Hyperextension / Back Extension (Machine or Bench)', sets: '3', reps: '10-15', description: 'Focus: strengthen lower back and glutes, controlled movement.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hyperextension.png' },
                    { name: 'Wall Angels', sets: '3', reps: '10-15', description: 'Focus: keep back, head, arms against wall, slide arms up and down slowly, excellent for posture.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/wall-angel.png' },
                    { name: 'Side Plank', sets: '3', reps: '30-45 sec per side', description: 'Focus: straight line from head to heels, engage core.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/side-plank.png' }
                ]
            }
        },
        'Week 2': {
            'Day 1': {
                title: 'Week 2: Full Body Strength & Posture (Increased Intensity)',
                exercises: [
                    { name: 'Leg Press Machine', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-press.png' },
                    { name: 'Seated Cable Row', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-cable-row.png' },
                    { name: 'Machine Chest Press', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/machine-chest-press.png' },
                    { name: 'Hamstring Curl Machine', sets: '3', reps: '12-15', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hamstring-curl.png' },
                    { name: 'Leg Extension Machine', sets: '3', reps: '12-15', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-extension.png' },
                    { name: 'Face Pulls (Cable Machine)', sets: '3', reps: '15-20', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/face-pull.png' },
                    { name: 'Plank', sets: '3', reps: '45-60 sec', description: 'Hold longer if possible.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/plank.png' }
                ]
            },
            'Day 2': {
                title: 'Week 2: Upper Body & Core (Increased Intensity)',
                exercises: [
                    { name: 'Lat Pulldown Machine', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lat-pulldown.png' },
                    { name: 'Machine Incline Chest Press', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/incline-press.png' },
                    { name: 'Machine Reverse Fly (Rear Delt Machine)', sets: '3', reps: '15-20', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/reverse-fly.png' },
                    { name: 'Single Arm Cable Row (Seated)', sets: '3', reps: '10-12 per arm', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/single-arm-cable-row.png' },
                    { name: 'Machine Lateral Raises (Very Light Weight)', sets: '3', reps: '15-20', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lateral-raise.png' },
                    { name: 'Cable Crunches', sets: '3', reps: '15-20', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/cable-crunch.png' },
                    { name: 'Bird-Dog', sets: '3', reps: '10-12 per side', description: 'Maintain control.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/bird-dog.png' }
                ]
            },
            'Day 3': {
                title: 'Week 2: Lower Body, Posterior Chain & Posture (Increased Intensity)',
                exercises: [
                    { name: 'Goblet Squat (with dumbbell) or Hack Squat Machine', sets: '3', reps: '10-12', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/goblet-squat.png' },
                    { name: 'Glute Bridge (bodyweight or with plate on hips)', sets: '3', reps: '12-15', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/glute-bridge.png' },
                    { name: 'Assisted Pull-up Machine (or Lat Pulldown if no machine)', sets: '3', reps: '8-12', description: 'Aim for RPE 7-8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/assisted-pull-up.png' },
                    { name: 'Seated Calf Raise Machine', sets: '3', reps: '15-20', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-calf-raise.png' },
                    { name: 'Hyperextension / Back Extension (Machine or Bench)', sets: '3', reps: '10-15', description: 'Aim for RPE 7-8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hyperextension.png' },
                    { name: 'Wall Angels', sets: '3', reps: '10-15', description: 'Maintain strict form.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/wall-angel.png' },
                    { name: 'Side Plank', sets: '3', reps: '45-60 sec per side', description: 'Hold longer if possible.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/side-plank.png' }
                ]
            }
        },
        'Week 3': {
            'Day 1': {
                title: 'Week 3: Full Body Strength & Posture (Peak Intensity)',
                exercises: [
                    { name: 'Leg Press Machine', sets: '4', reps: '8-12', description: 'Increase to 4 sets, aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-press.png' },
                    { name: 'Seated Cable Row', sets: '4', reps: '8-12', description: 'Increase to 4 sets, aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-cable-row.png' },
                    { name: 'Machine Chest Press', sets: '3', reps: '8-12', description: 'Aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/machine-chest-press.png' },
                    { name: 'Hamstring Curl Machine', sets: '3', reps: '10-15', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hamstring-curl.png' },
                    { name: 'Leg Extension Machine', sets: '3', reps: '10-15', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-extension.png' },
                    { name: 'Face Pulls (Cable Machine)', sets: '4', reps: '15-20', description: 'Increase to 4 sets, focus on form.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/face-pull.png' },
                    { name: 'Plank', sets: '3', reps: 'Max Hold', description: 'Push for your maximum hold time.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/plank.png' }
                ]
            },
            'Day 2': {
                title: 'Week 3: Upper Body & Core (Peak Intensity)',
                exercises: [
                    { name: 'Lat Pulldown Machine', sets: '4', reps: '8-12', description: 'Increase to 4 sets, aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lat-pulldown.png' },
                    { name: 'Machine Incline Chest Press', sets: '3', reps: '8-12', description: 'Aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/incline-press.png' },
                    { name: 'Machine Reverse Fly (Rear Delt Machine)', sets: '4', reps: '12-15', description: 'Increase to 4 sets, focus on form.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/reverse-fly.png' },
                    { name: 'Single Arm Cable Row (Seated)', sets: '3', reps: '8-12 per arm', description: 'Aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/single-arm-cable-row.png' },
                    { name: 'Machine Lateral Raises (Very Light Weight)', sets: '3', reps: '12-15', description: 'Aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/lateral-raise.png' },
                    { name: 'Cable Crunches', sets: '3', reps: '15-20', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/cable-crunch.png' },
                    { name: 'Dead Bug', sets: '3', reps: '10-12 per side', description: 'Slow and controlled for core stability.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/dead-bug.png' }
                ]
            },
            'Day 3': {
                title: 'Week 3: Lower Body, Posterior Chain & Posture (Peak Intensity)',
                exercises: [
                    { name: 'Goblet Squat (with dumbbell) or Hack Squat Machine', sets: '4', reps: '8-12', description: 'Increase to 4 sets, aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/goblet-squat.png' },
                    { name: 'Glute Bridge (bodyweight or with plate on hips)', sets: '3', reps: '10-15', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/glute-bridge.png' },
                    { name: 'Assisted Pull-up Machine (or Lat Pulldown if no machine)', sets: '4', reps: '8-12', description: 'Aim for RPE 8. (Shoulder Caution)', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/assisted-pull-up.png' },
                    { name: 'Seated Calf Raise Machine', sets: '3', reps: '15-20', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/seated-calf-raise.png' },
                    { name: 'Hyperextension / Back Extension (Machine or Bench)', sets: '3', reps: '10-15', description: 'Aim for RPE 8.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/hyperextension.png' },
                    { name: 'Wall Angels', sets: '3', reps: '10-15', description: 'Maintain strict form, focus on contact.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/wall-angel.png' },
                    { name: 'Side Plank', sets: '3', reps: 'Max Hold', description: 'Push for your maximum hold time per side.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/side-plank.png' }
                ]
            }
        }
    };

    // New: Specific exercises for Active Recovery/Mobility days
    const mobilityRecoveryExercises = [
        { name: 'Cat-Cow Stretch', sets: '3', reps: '10-15', description: 'Improves spinal mobility and flexibility. Focus on coordinating breath with movement.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/cat-cow.png' },
        { name: 'Thread the Needle', sets: '3', reps: '8-10 per side', description: 'Stretches upper back, shoulders, and triceps. Focus on reaching through and gentle rotation.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/thread-the-needle.png' },
        { name: 'Standing Thoracic Extension', sets: '3', reps: '10-12', description: 'Opens up the chest and improves posture. Use a wall or foam roller if available.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/thoracic-extension.png' },
        { name: 'Leg Swings', sets: '3', reps: '10-15 per leg (forward/backward & side-to-side)', description: 'Dynamic warm-up for hips and hamstrings. Control the swing, don\'t just let gravity do the work.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/leg-swings.png' },
        { name: 'Arm Circles', sets: '3', reps: '15-20 (forward & backward)', description: 'Improves shoulder mobility and warms up the rotator cuff. Start small and gradually increase range.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/arm-circles.png' },
        { name: 'Spinal Twists (seated or lying)', sets: '3', reps: '10-12 per side', description: 'Gentle rotation for spinal health. Move slowly and within a comfortable range of motion.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/spinal-twist.png' },
        { name: 'Light Cardio (e.g., Walk/Bike/Swim)', sets: '1', reps: '20-30 mins', description: 'Low-intensity activity for blood flow and recovery. Keep your heart rate at a conversational pace.', img: 'https://cdn.jsdelivr.net/gh/schuylerf/workout-tracker-images@main/light-cardio.png' }
    ];


    // This array will hold the actual dates of your workout days, mapped from workoutPlan
    const workoutSchedule = [];
    const restDayTitle = 'Rest Day';
    const activeRecoveryTitle = 'Active Recovery / Mobility';

    // Function to calculate and populate the workout schedule based on current date
    function populateWorkoutSchedule(startDate) {
        workoutSchedule.length = 0; // Clear existing schedule

        let currentWorkoutDayIndex = 0; // Tracks Day 1, Day 2, Day 3 within a week
        let currentWeekIndex = 0; // Tracks Week 1, Week 2, Week 3, Week 4
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const daysInWorkoutWeek = ['Day 1', 'Day 2', 'Day 3']; // The names of your workout days

        // Populate for 4 weeks (28 days total in the plan)
        for (let i = 0; i < 28; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

            let dayPlan = null;
            let type = 'rest'; // Default to rest day

            // Check if there's a workout day to assign for the current week and day slot
            if (currentWeekIndex < weeks.length) {
                const currentWeekKey = weeks[currentWeekIndex];
                const weekPlan = workoutPlan[currentWeekKey];

                if (weekPlan) {
                    if (currentWorkoutDayIndex < daysInWorkoutWeek.length) {
                        const currentDayKey = daysInWorkoutWeek[currentWorkoutDayIndex];
                        dayPlan = weekPlan[currentDayKey];
                        if (dayPlan) {
                            type = 'workout';
                            // Add a property to store actual logged data for exercises
                            // Changed: loggedSets now tracks 'completed' status per set
                            dayPlan.exercises = dayPlan.exercises.map(ex => ({
                                ...ex,
                                loggedSets: Array(parseInt(ex.sets)).fill({ completed: false })
                            }));
                            currentWorkoutDayIndex++; // Move to the next workout day slot
                        }
                    }
                }
            }

            workoutSchedule.push({
                date: formattedDate,
                type: type,
                plan: dayPlan, // Will be null for rest days initially, or populated with workout
                completed: false, // Default status
                notes: '' // Default empty notes
            });

            // Logic to insert rest days and advance to next workout week
            if (type === 'workout') {
                if (currentWorkoutDayIndex === 1) { // After Day 1, add 1 rest day
                    i += 1;
                    const restDate1 = new Date(startDate);
                    restDate1.setDate(startDate.getDate() + i);
                    workoutSchedule.push({
                        date: `${restDate1.getFullYear()}-${String(restDate1.getMonth() + 1).padStart(2, '0')}-${String(restDate1.getDate()).padStart(2, '0')}`,
                        type: 'rest',
                        plan: { title: restDayTitle },
                        completed: false,
                        notes: ''
                    });
                } else if (currentWorkoutDayIndex === 2) { // After Day 2, add 1 rest day
                    i += 1;
                    const restDate2 = new Date(startDate);
                    restDate2.setDate(startDate.getDate() + i);
                    workoutSchedule.push({
                        date: `${restDate2.getFullYear()}-${String(restDate2.getMonth() + 1).padStart(2, '0')}-${String(restDate2.getDate()).padStart(2, '0')}`,
                        type: 'rest',
                        plan: { title: restDayTitle },
                        completed: false,
                        notes: ''
                    });
                } else if (currentWorkoutDayIndex === 3) { // After Day 3, reset for next week and add 2 rest days
                    i += 2; // Consume 2 days for rest
                    // Add first rest day (e.g., Active Recovery) - NOW WITH EXERCISES
                    const restDate3_1 = new Date(startDate);
                    restDate3_1.setDate(startDate.getDate() + i - 1);
                    workoutSchedule.push({
                        date: `${restDate3_1.getFullYear()}-${String(restDate3_1.getMonth() + 1).padStart(2, '0')}-${String(restDate3_1.getDate()).padStart(2, '0')}`, // Corrected: changed 'rest3_1' to 'restDate3_1'
                        type: 'rest',
                        plan: {
                            title: activeRecoveryTitle,
                            // Initialize logged sets for mobility exercises too
                            // Changed: loggedSets now tracks 'completed' status per set
                            exercises: mobilityRecoveryExercises.map(ex => ({
                                ...ex,
                                loggedSets: Array(parseInt(ex.sets)).fill({ completed: false })
                            }))
                        },
                        completed: false,
                        notes: ''
                    });
                    // Add second rest day
                    const restDate3_2 = new Date(startDate);
                    restDate3_2.setDate(startDate.getDate() + i);
                    workoutSchedule.push({
                        date: `${restDate3_2.getFullYear()}-${String(restDate3_2.getMonth() + 1).padStart(2, '0')}-${String(restDate3_2.getDate()).padStart(2, '0')}`,
                        type: 'rest',
                        plan: { title: restDayTitle },
                        completed: false,
                        notes: ''
                    });

                    currentWorkoutDayIndex = 0; // Reset for next week's workouts
                    currentWeekIndex++; // Move to next workout plan week
                }
            }

            if (workoutSchedule.length >= 28) break; // Ensure we don't go past 28 days for the core plan
        }
    }


    // --- Local Storage Management (for saving progress) ---
    function saveProgress() {
        localStorage.setItem('workoutProgress', JSON.stringify(workoutSchedule));
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem('workoutProgress');
        if (savedProgress) {
            const loadedSchedule = JSON.parse(savedProgress);
            // Merge loaded progress (completed status, notes, and loggedSets) into the current workoutSchedule
            loadedSchedule.forEach(loadedDay => {
                const existingDay = workoutSchedule.find(d => d.date === loadedDay.date);
                if (existingDay) {
                    existingDay.completed = loadedDay.completed || false; // Ensure it's boolean
                    existingDay.notes = loadedDay.notes || ''; // Ensure it's string
                    // Also load loggedSets if available
                    // Corrected: Add check for existingDay.plan.exercises before forEach
                    if (existingDay.plan && existingDay.plan.exercises && loadedDay.plan && loadedDay.plan.exercises) {
                        existingDay.plan.exercises.forEach((ex, exIndex) => {
                            // Changed: Load the 'completed' status for each set
                            if (loadedDay.plan.exercises[exIndex] && loadedDay.plan.exercises[exIndex].loggedSets) {
                                ex.loggedSets = loadedDay.plan.exercises[exIndex].loggedSets.map(ls => ({
                                    completed: ls.completed || false
                                }));
                            }
                        });
                    }
                }
            });
        }
    }


    // --- Calendar Rendering Function ---
    function renderCalendar() {
        // Clear previous days but keep day headers
        calendarGrid.innerHTML = `
            <div class="day-header">Sun</div>
            <div class="day-header">Mon</div>
            <div class="day-header">Tue</div>
            <div class="day-header">Wed</div>
            <div class="day-header">Thu</div>
            <div class="day-header">Fri</div>
            <div class="day-header">Sat</div>
        `;

        currentMonthYearDisplay.textContent = currentDate.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        // Get first and last day of the current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
        const startDayIndex = firstDayOfMonth.getDay();

        // Get today's actual date for highlighting
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


        // Add empty cells for the days before the first day of the month
        for (let i = 0; i < startDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyDiv);
        }

        // Add days of the month
        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
            const dayDiv = document.createElement('div');
            const fullDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const formattedDate = `${fullDate.getFullYear()}-${String(fullDate.getMonth() + 1).padStart(2, '0')}-${String(fullDate.getDate()).padStart(2, '0')}`;

            dayDiv.classList.add('calendar-day');
            dayDiv.dataset.date = formattedDate; // Store the full date in a data attribute
            dayDiv.innerHTML = `<span class="date-number">${day}</span>`;

            // Highlight current day
            if (formattedDate === todayString) {
                dayDiv.classList.add('current-day');
            }

            // Check against workoutSchedule array for workout/rest days and completed status
            const scheduledDay = workoutSchedule.find(item => item.date === formattedDate);

            if (scheduledDay) {
                if (scheduledDay.type === 'workout' && scheduledDay.plan) {
                    dayDiv.classList.add('has-workout');
                    dayDiv.innerHTML += `<div class="workout-title-label">${scheduledDay.plan.title}</div>`;
                } else if (scheduledDay.type === 'rest' && scheduledDay.plan) {
                    dayDiv.classList.add('rest-day');
                    dayDiv.innerHTML += `<div class="workout-title-label">${scheduledDay.plan.title}</div>`;
                }

                // Add checkmark and red color if completed
                if (scheduledDay.completed) {
                    dayDiv.classList.add('completed', 'completed-red'); // Add both classes
                    dayDiv.innerHTML += '<span class="checkmark">&#10003;</span>'; // Checkmark symbol
                }
            }

            calendarGrid.appendChild(dayDiv);
        }
    }

    // --- Function to update workout details display when a day is clicked ---
    function updateWorkoutDetails(selectedDate) {
        currentSelectedDate = selectedDate; // Store the currently selected date globally
        const scheduledDay = workoutSchedule.find(item => item.date === selectedDate);
        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (scheduledDay && scheduledDay.plan) { // Ensure scheduledDay and its plan exist
            workoutDetails.innerHTML = `
                <h2>${scheduledDay.plan.title} - ${selectedDate}</h2>
                <ul class="exercise-list">
                    ${scheduledDay.plan.exercises ? scheduledDay.plan.exercises.map(ex => `
                        <li class="exercise-item">
                            <img src="${ex.img || 'https://via.placeholder.com/80x80?text=No+Image'}" alt="${ex.name}">
                            <div class="exercise-item-content">
                                <h3>${ex.name}</h3>
                                <p>Sets: ${ex.sets} | Reps: ${ex.reps}</p>
                                <p>${ex.description}</p>
                            </div>
                        </li>
                    `).join('') : '<p>No specific activities listed for this day.</p>'}
                </ul>
                ${scheduledDay.type === 'workout' && (selectedDate <= todayString) && !scheduledDay.completed ? `<button id="startWorkoutBtn" data-date="${selectedDate}">Start Workout</button>` : ''}
                ${scheduledDay.completed ? `<p style="color: green; font-weight: bold; margin-top: 15px;">Day Completed!</p>` : ''}
                <div class="daily-notes-section">
                    <label for="dailyNotes">Notes for ${selectedDate}:</label>
                    <textarea id="dailyNotes" rows="4" placeholder="Log your weight used, pain level, comments..."></textarea>
                </div>
            `;
            const notesField = document.getElementById('dailyNotes');
            if (scheduledDay.notes) {
                notesField.value = scheduledDay.notes;
            }
            notesField.addEventListener('input', () => {
                scheduledDay.notes = notesField.value;
                saveProgress();
            });

            // Add event listener for Start Workout button (if it exists)
            const startBtn = document.getElementById('startWorkoutBtn');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    renderWorkoutSession(startBtn.dataset.date);
                });
            }

        } else { // Fallback for any unexpected cases or if 'plan' is null
            workoutDetails.innerHTML = `
                <h2>${scheduledDay ? scheduledDay.plan.title : 'No Plan'} - ${selectedDate}</h2>
                <p>No specific workout or activity is scheduled for this date.</p>
                 <div class="daily-notes-section">
                    <label for="dailyNotes">Notes for ${selectedDate}:</label>
                    <textarea id="dailyNotes" rows="4" placeholder="Log your energy levels, activities..."></textarea>
                </div>
            `;
             const notesField = document.getElementById('dailyNotes');
            if (scheduledDay && scheduledDay.notes) { // Ensure scheduledDay exists before checking notes
                notesField.value = scheduledDay.notes;
            }
            if (scheduledDay) { // Ensure scheduledDay exists before attaching listener
                notesField.addEventListener('input', () => {
                    scheduledDay.notes = notesField.value;
                    saveProgress();
                });
            }
        }
    }

    // --- Functions to manage view visibility ---
    function showCalendarView() {
        mainAppContainer.style.display = 'block';
        workoutSessionContainer.style.display = 'none';
        renderCalendar(); // Re-render calendar to update completion status if needed
        if (currentSelectedDate) {
            updateWorkoutDetails(currentSelectedDate); // Show details for the last selected day
        }
    }

    function showWorkoutSessionView() {
        mainAppContainer.style.display = 'none';
        workoutSessionContainer.style.display = 'block';
    }


    // --- Timer Functions ---
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    function startTimer(duration) {
        if (timerInterval) clearInterval(timerInterval); // Clear any existing timer
        timeLeft = duration;
        restTimerDisplay.textContent = formatTime(timeLeft);
        startTimerBtn.textContent = 'Pause Timer';
        startTimerBtn.onclick = pauseTimer; // Change button action

        timerInterval = setInterval(() => {
            timeLeft--;
            restTimerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                restTimerDisplay.textContent = '00:00 - Rest Done!';
                startTimerBtn.textContent = 'Start Rest Timer (60s)';
                startTimerBtn.onclick = () => startTimer(defaultRestTime); // Reset button action
                // Optional: Play a sound or vibrate
                // new Audio('path/to/short-beep.mp3').play();
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timerInterval);
        startTimerBtn.textContent = 'Resume Timer';
        startTimerBtn.onclick = resumeTimer;
    }

    function resumeTimer() {
        startTimer(timeLeft); // Continue from where it left off
    }

    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = defaultRestTime;
        restTimerDisplay.textContent = formatTime(timeLeft);
        startTimerBtn.textContent = 'Start Rest Timer (60s)';
        startTimerBtn.onclick = () => startTimer(defaultRestTime);
    }

    // --- Function to render the workout session details (step-by-step) ---
    function renderWorkoutSession(date) {
        showWorkoutSessionView();
        resetTimer(); // Reset timer when starting a new session

        const scheduledDay = workoutSchedule.find(item => item.date === date);
        if (!scheduledDay || !scheduledDay.plan || !scheduledDay.plan.exercises || scheduledDay.plan.exercises.length === 0) {
            sessionWorkoutTitle.textContent = `${scheduledDay ? scheduledDay.plan.title : 'No Plan'} - ${date}`;
            currentExerciseDisplay.innerHTML = '<p>No exercises listed for this day.</p>';
            prevExerciseBtn.style.display = 'none';
            nextExerciseBtn.style.display = 'none';
            finishWorkoutBtn.style.display = 'block'; // Still allow finishing if no exercises
            return;
        }

        currentWorkoutPlan = scheduledDay.plan; // Store the plan for navigation
        currentExerciseIndex = 0; // Start with the first exercise
        displayCurrentExercise();
    }

    // --- Function to display the current exercise ---
    function displayCurrentExercise() {
        const exercise = currentWorkoutPlan.exercises[currentExerciseIndex];

        sessionWorkoutTitle.textContent = `${currentWorkoutPlan.title} - ${currentSelectedDate} (Exercise ${currentExerciseIndex + 1} of ${currentWorkoutPlan.exercises.length})`;

        currentExerciseDisplay.innerHTML = `
            <h3>${exercise.name}</h3>
            <img src="${exercise.img || 'https://via.placeholder.com/150x150?text=No+Image'}" alt="${exercise.name}">
            <p>${exercise.description}</p>
            <div class="sets-tracking">
                <h4>Sets (${exercise.sets} planned):</h4>
                ${Array.from({ length: parseInt(exercise.sets) }).map((_, setIndex) => `
                    <div class="set-row">
                        <label>Set ${setIndex + 1}: ${exercise.reps} reps</label>
                        <input type="checkbox" class="set-completed-checkbox"
                               ${exercise.loggedSets[setIndex] && exercise.loggedSets[setIndex].completed ? 'checked' : ''}
                               data-exercise-index="${currentExerciseIndex}" data-set-index="${setIndex}">
                    </div>
                `).join('')}
            </div>
            <button id="markExerciseDoneBtn">Mark Exercise Done</button>
        `;

        // Add event listeners for set completion checkboxes
        currentExerciseDisplay.querySelectorAll('.set-completed-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const exIndex = event.target.dataset.exerciseIndex;
                const setIndex = event.target.dataset.setIndex;
                currentWorkoutPlan.exercises[exIndex].loggedSets[setIndex].completed = event.target.checked;
                saveProgress();
            });
        });


        // Add listener for Mark Exercise Done button
        const markExerciseDoneBtn = document.getElementById('markExerciseDoneBtn');
        if (markExerciseDoneBtn) {
            markExerciseDoneBtn.addEventListener('click', () => {
                // Optionally add visual feedback here like changing button color or disabling
                alert(`Exercise "${exercise.name}" marked as done!`);
            });
        }


        // Manage navigation button visibility
        prevExerciseBtn.style.display = currentExerciseIndex > 0 ? 'block' : 'none';
        nextExerciseBtn.style.display = currentExerciseIndex < currentWorkoutPlan.exercises.length - 1 ? 'block' : 'none';
        finishWorkoutBtn.style.display = currentExerciseIndex === currentWorkoutPlan.exercises.length - 1 ? 'block' : 'none';

        // Set the session title to reflect current date
        // sessionWorkoutTitle.textContent = `${currentWorkoutPlan.title} - ${currentSelectedDate} (Exercise ${currentExerciseIndex + 1} of ${currentWorkoutPlan.exercises.length})`;
    }


    // --- Event Listeners ---

    // Month Navigation Buttons
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    // Clicking on a Day in the Calendar Grid
    calendarGrid.addEventListener('click', (event) => {
        const dayDiv = event.target.closest('.calendar-day');
        if (dayDiv && !dayDiv.classList.contains('empty')) {
            const selectedDate = dayDiv.dataset.date;
            updateWorkoutDetails(selectedDate);
        }
    });

    // Back to Calendar Button Listener
    backToCalendarBtn.addEventListener('click', () => {
        showCalendarView();
    });

    // Finish Workout Button Listener
    finishWorkoutBtn.addEventListener('click', () => {
        const scheduledDay = workoutSchedule.find(item => item.date === currentSelectedDate);
        if (scheduledDay) {
            scheduledDay.completed = true;
            saveProgress();
            alert('Workout completed and saved!');
            showCalendarView(); // Go back to calendar view
        }
    });

    // Timer buttons
    startTimerBtn.addEventListener('click', () => startTimer(defaultRestTime));

    // Exercise navigation buttons
    prevExerciseBtn.addEventListener('click', () => {
        if (currentExerciseIndex > 0) {
            currentExerciseIndex--;
            displayCurrentExercise();
            resetTimer(); // Reset timer when moving to next/previous exercise
        }
    });

    nextExerciseBtn.addEventListener('click', () => {
        if (currentExerciseIndex < currentWorkoutPlan.exercises.length - 1) {
            currentExerciseIndex++;
            displayCurrentExercise();
            resetTimer(); // Reset timer when moving to next/previous exercise
        }
    });


    // --- Initialization on Page Load ---
    // This runs when the HTML content is fully loaded

    // New logic to handle program start date
    let programStartDate;
    const savedProgramStartDate = localStorage.getItem('programStartDate');

    if (savedProgramStartDate) {
        programStartDate = new Date(savedProgramStartDate);
        console.log('Workout program started on (loaded):', programStartDate.toISOString().split('T')[0]);
    } else {
        // If no start date is saved, set it to yesterday and save it
        programStartDate = new Date(); // Start with today's date
        programStartDate.setDate(programStartDate.getDate() - 1); // Subtract 1 day to make it yesterday

        localStorage.setItem('programStartDate', programStartDate.toISOString().split('T')[0]); // Save as YYYY-MM-DD
        console.log('Workout program started on (newly set to yesterday):', programStartDate.toISOString().split('T')[0]);
    }

    populateWorkoutSchedule(programStartDate); // Generate the full 4-week schedule based on the persistent start date
    loadProgress(); // Load any saved completion/notes from localStorage
    showCalendarView(); // Start by showing the calendar view
    updateWorkoutDetails(
        `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    ); // Show details for today's date initially (or the first day of the plan if today is earlier)
});
