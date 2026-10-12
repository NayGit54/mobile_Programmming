
/* Import React hooks to manage data, run code when the screen opens,
   and store values without causing a re-render. */
import React, { useEffect, useRef, useState } from "react";

/* Import React Native components to build the app's interface. */
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    StatusBar,
    Pressable,
    Alert,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";

/* Import the existing Firebase database connection. */
import { database } from "../lib/firebase";

/* Import Firebase functions to read, save, and update task data. */
import {
    ref,
    push,
    set,
    onValue,
    update,
} from "firebase/database";

/* Define the structure of a task so every task has the same fields. */
type Task = {
    id: string;
    title: string;
    type: string;
    startTime: string;
    endTime: string;
    completed: boolean;
};

/* Create sample tasks to show when the Firebase database is empty.
   The database ID will be generated automatically when saving. */
const initialTasks: Omit<Task, "id">[] = [
    {
        title: "Review lecture notes",
        type: "Revision",
        startTime: "09:00 AM",
        endTime: "09:30 AM",
        completed: false,
    },
    {
        title: "Practice Python problems",
        type: "Assignment",
        startTime: "11:00 AM",
        endTime: "11:45 AM",
        completed: false,
    },
    {
        title: "Revise Chapter 3",
        type: "Exam Prep",
        startTime: "02:00 PM",
        endTime: "02:30 PM",
        completed: false,
    },
];

/* Store the task types that users can choose from. */
const taskTypes = ["Study", "Revision", "Assignment", "Exam Prep"];

/* Assign an emoji to each task type for easy identification. */
const taskEmojis: Record<string, string> = {
    Study: "📚",
    Revision: "🔄",
    Assignment: "✍️",
    "Exam Prep": "🎯",
};

/* Convert a time such as 02:30 PM into minutes after midnight.
   This helps compare times and arrange tasks in chronological order. */
function timeToMinutes(time: string) {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    // Return zero if the time does not match the expected format.
    if (!match) return 0;

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();

    // Convert 12 AM and 12 PM correctly into 24-hour time.
    if (hours === 12) hours = 0;
    if (period === "PM") hours += 12;

    // Return the total number of minutes after midnight.
    return hours * 60 + minutes;
}

/* Check whether the entered time follows the required AM/PM format. */
function isValidTime(time: string) {
    return /^((0?[1-9])|(1[0-2])):[0-5]\d\s?(AM|PM)$/i.test(
        time.trim()
    );
}

/* Create the main dashboard screen of the StudyAI application. */
export default function HomeScreen() {

    /* Store the tasks loaded from Firebase. */
    const [tasks, setTasks] = useState<Task[]>([]);

    /* Track whether the app is loading tasks or saving a new task. */
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    /* Control whether the Add Task popup is visible. */
    const [modalVisible, setModalVisible] = useState(false);

    /* Store the values entered into the Add Task form. */
    const [taskTitle, setTaskTitle] = useState("");
    const [taskType, setTaskType] = useState("Study");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    /* Prevent the sample tasks from being added repeatedly
       during the same screen session. */
    const seeded = useRef(false);

    /* Connect to Firebase when the dashboard opens.
       Also listen for database changes so the task list stays updated. */
    useEffect(() => {

        // Point to the tasks section in Firebase Realtime Database.
        const tasksRef = ref(database, "tasks");

        // Listen for changes to the tasks stored in Firebase.
        const unsubscribe = onValue(
            tasksRef,
            async (snapshot) => {

                // Read the current data from Firebase.
                const data = snapshot.val();

                /* If there are no saved tasks, display an empty list
                   and add sample tasks the first time. */
                if (data === null) {
                    setTasks([]);

                    if (!seeded.current) {
                        seeded.current = true;

                        try {
                            // Save the sample tasks with unique Firebase IDs.
                            await Promise.all(
                                initialTasks.map((task) => {
                                    const newTaskRef = push(tasksRef);
                                    return set(newTaskRef, task);
                                })
                            );
                        } catch (error) {
                            // Show an error if the sample tasks cannot be saved.
                            console.error("Could not add sample tasks:", error);
                            Alert.alert(
                                "Firebase error",
                                "Could not save the sample tasks. Check your database rules and connection."
                            );
                        }
                    }

                    // Finish loading and stop processing this snapshot.
                    setLoading(false);
                    return;
                }

                /* Convert Firebase data into an array that can be
                   displayed by React Native. */
                const loadedTasks: Task[] = Object.entries(data).map(
                    ([id, value]) => {
                        const task = value as Omit<Task, "id">;

                        // Keep the Firebase ID and provide default values
                        // if any task fields are missing.
                        return {
                            id,
                            title: task.title ?? "",
                            type: task.type ?? "Study",
                            startTime: task.startTime ?? "",
                            endTime: task.endTime ?? "",
                            completed: task.completed ?? false,
                        };
                    }
                );

                /* Arrange the tasks according to their start times. */
                loadedTasks.sort(
                    (a, b) =>
                        timeToMinutes(a.startTime) -
                        timeToMinutes(b.startTime)
                );

                // Update the dashboard with the latest Firebase data.
                setTasks(loadedTasks);
                setLoading(false);
            },

            /* Handle errors that occur while reading Firebase data. */
            (error) => {
                console.error("Firebase read error:", error);
                setLoading(false);
                Alert.alert(
                    "Unable to load tasks",
                    "Check your internet connection and Firebase Realtime Database rules."
                );
            }
        );

        // Stop listening to Firebase when the screen unmounts.
        return unsubscribe;
    }, []);

    /* Validate the form and save a new task to Firebase. */
    const addTask = async () => {

        // Remove extra spaces and standardize the entered times.
        const title = taskTitle.trim();
        const start = startTime.trim().toUpperCase();
        const end = endTime.trim().toUpperCase();

        // Make sure the task name is not empty.
        if (!title) {
            Alert.alert("Missing task", "Please enter a task name.");
            return;
        }

        // Check that both times use a valid AM/PM format.
        if (!isValidTime(start) || !isValidTime(end)) {
            Alert.alert(
                "Invalid time",
                "Enter times in the format 09:00 AM or 02:30 PM."
            );
            return;
        }

        // Make sure the end time is later than the start time.
        if (timeToMinutes(end) <= timeToMinutes(start)) {
            Alert.alert(
                "Invalid time period",
                "The end time must be later than the start time."
            );
            return;
        }

        // Show a loading indicator while the task is being saved.
        setSaving(true);

        try {
            // Select the tasks section in Firebase.
            const tasksRef = ref(database, "tasks");

            // Generate a unique ID for the new task.
            const newTaskRef = push(tasksRef);

            // Save the task details under the generated ID.
            await set(newTaskRef, {
                title,
                type: taskType,
                startTime: start,
                endTime: end,
                completed: false,
            });

            // Clear the form and close the popup after saving.
            setTaskTitle("");
            setTaskType("Study");
            setStartTime("");
            setEndTime("");
            setModalVisible(false);

        } catch (error) {
            // Inform the user if Firebase cannot save the task.
            console.error("Firebase save error:", error);
            Alert.alert(
                "Could not save task",
                "Please check your Firebase connection and database rules, then try again."
            );

        } finally {
            // Stop showing the loading indicator.
            setSaving(false);
        }
    };

    /* Update a task's completion status in Firebase when tapped. */
    const toggleTask = async (task: Task) => {
        try {
            // Update only the completed field of the selected task.
            await update(ref(database, `tasks/${task.id}`), {
                completed: !task.completed,
            });
        } catch (error) {
            // Display an error if the completion status cannot be saved.
            console.error("Firebase update error:", error);
            Alert.alert(
                "Update failed",
                "Could not update this task. Please try again."
            );
        }
    };

    /* Count completed tasks and calculate the overall progress. */
    const completedCount = tasks.filter(
        (task) => task.completed
    ).length;

    // Avoid dividing by zero when there are no tasks.
    const progress =
        tasks.length > 0 ? completedCount / tasks.length : 0;

    /* Build the visual layout of the dashboard. */
    return (
        <View style={styles.container}>

            {/* Set the status bar appearance for the app. */}
            <StatusBar barStyle="dark-content" backgroundColor="#F7F9F5" />

            {/* Allow users to scroll through the dashboard. */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Header: show the app name, tagline, and profile icon. */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.eyebrow}>YOUR STUDY COMPANION</Text>
                        <Text style={styles.logo}>Study<Text style={styles.logoAccent}>AI</Text></Text>
                        <Text style={styles.subtitle}>
                            Learn smarter, one day at a time.
                        </Text>
                    </View>

                    <View style={styles.profileIcon}>
                        <Text style={styles.profileText}>👤</Text>
                    </View>
                </View>

                {/* Welcome card: introduce the app and open the Add Task form. */}
                <View style={styles.heroCard}>
                    <Text style={styles.heroLabel}>YOUR DAILY GOAL</Text>
                    <Text style={styles.heroTitle}>
                        Small steps.{"\n"}Big results.
                    </Text>
                    <Text style={styles.heroDescription}>
                        Make every study session count. Plan your day and
                        stay focused on your goals.
                    </Text>

                    <Pressable
                        style={styles.heroButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.heroButtonText}>
                            + Add a study task
                        </Text>
                    </Pressable>
                </View>

                {/* Today's Tasks heading and button for creating a task. */}
                <View style={styles.sectionHeader}>
                    <View>
                        <Text style={styles.sectionTitle}>Today's Tasks</Text>
                        <Text style={styles.sectionSubtitle}>
                            Your daily study checklist
                        </Text>
                    </View>

                    <Pressable
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={styles.addButtonText}>+ Add Task</Text>
                    </Pressable>
                </View>

                {/* Show how many tasks are completed and display a progress bar. */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTop}>
                        <Text style={styles.progressText}>
                            {completedCount} of {tasks.length} tasks completed
                        </Text>
                        <Text style={styles.progressPercent}>
                            {Math.round(progress * 100)}%
                        </Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${progress * 100}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* Display a loading message, an empty state, or the task list. */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#477A58" />
                        <Text style={styles.loadingText}>
                            Loading your tasks...
                        </Text>
                    </View>
                ) : tasks.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyEmoji}>📝</Text>
                        <Text style={styles.emptyTitle}>No tasks yet</Text>
                        <Text style={styles.emptyDescription}>
                            Add your first task and start planning your day.
                        </Text>
                    </View>
                ) : (
                    // Create one task card for every task from Firebase.
                    tasks.map((task) => (
                        <Pressable
                            key={task.id}
                            style={[
                                styles.taskCard,
                                task.completed && styles.completedTaskCard,
                            ]}
                            // Tapping the task toggles its completion status.
                            onPress={() => toggleTask(task)}
                        >
                            {/* Show a checkmark when the task is completed. */}
                            <View
                                style={[
                                    styles.checkbox,
                                    task.completed && styles.checkboxChecked,
                                ]}
                            >
                                {task.completed && (
                                    <Text style={styles.checkmark}>✓</Text>
                                )}
                            </View>

                            {/* Show an emoji that represents the task type. */}
                            <View style={styles.taskIcon}>
                                <Text style={styles.taskEmoji}>
                                    {taskEmojis[task.type] ?? "📘"}
                                </Text>
                            </View>

                            {/* Show the task name, type, and scheduled time. */}
                            <View style={styles.taskInfo}>
                                <Text
                                    style={[
                                        styles.taskTitle,
                                        task.completed && styles.completedTaskTitle,
                                    ]}
                                >
                                    {task.title}
                                </Text>

                                <Text style={styles.taskType}>{task.type}</Text>

                                <Text style={styles.taskTime}>
                                    {task.startTime} – {task.endTime}
                                </Text>
                            </View>
                        </Pressable>
                    ))
                )}

                {/* Workspace: introduce the app's other planned features. */}
                <Text style={[styles.sectionTitle, styles.workspaceHeading]}>
                    Your Workspace
                </Text>
                <Text style={styles.sectionSubtitle}>
                    Everything you need to prepare
                </Text>

                {/* Study Materials card for textbooks, notes, and PYQs. */}
                <View style={styles.workspaceCard}>
                    <View style={styles.workspaceIcon}>
                        <Text style={styles.workspaceEmoji}>📚</Text>
                    </View>
                    <View style={styles.workspaceInfo}>
                        <Text style={styles.workspaceTitle}>Study Materials</Text>
                        <Text style={styles.workspaceDescription}>
                            Organize textbooks, notes, and PYQs.
                        </Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </View>

                {/* Important Topics card for exam preparation. */}
                <View style={styles.workspaceCard}>
                    <View style={styles.workspaceIcon}>
                        <Text style={styles.workspaceEmoji}>🎯</Text>
                    </View>
                    <View style={styles.workspaceInfo}>
                        <Text style={styles.workspaceTitle}>Important Topics</Text>
                        <Text style={styles.workspaceDescription}>
                            Focus on topics that matter most.
                        </Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </View>

                {/* Study Planner card for organizing schedules and deadlines. */}
                <View style={styles.workspaceCard}>
                    <View style={styles.workspaceIcon}>
                        <Text style={styles.workspaceEmoji}>📅</Text>
                    </View>
                    <View style={styles.workspaceInfo}>
                        <Text style={styles.workspaceTitle}>Study Planner</Text>
                        <Text style={styles.workspaceDescription}>
                            Organize study sessions and deadlines.
                        </Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </View>

                {/* Display a helpful study tip on the dashboard. */}
                <View style={styles.tipCard}>
                    <Text style={styles.tipTitle}>💡 Study Tip</Text>
                    <Text style={styles.tipDescription}>
                        Break large topics into smaller sessions and review
                        them regularly to improve your learning.
                    </Text>
                </View>

                {/* Display the app's footer message. */}
                <Text style={styles.footer}>
                    Made for students, designed for success.
                </Text>
            </ScrollView>

            {/* Add Task modal: opens when the user taps either Add Task button. */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                {/* Keep the form visible when the phone keyboard opens. */}
                <KeyboardAvoidingView
                    style={styles.modalOverlay}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <View style={styles.modalCard}>

                        {/* Show the form heading and a button to close it. */}
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalTitle}>Add New Task</Text>
                                <Text style={styles.modalSubtitle}>
                                    Plan your next study session.
                                </Text>
                            </View>

                            <Pressable
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </Pressable>
                        </View>

                        {/* Input field for the task name. */}
                        <Text style={styles.inputLabel}>Task name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Study Python functions"
                            placeholderTextColor="#929A91"
                            value={taskTitle}
                            onChangeText={setTaskTitle}
                            maxLength={100}
                        />

                        {/* Let users select the type of task they are creating. */}
                        <Text style={styles.inputLabel}>Task type</Text>
                        <View style={styles.typeContainer}>
                            {taskTypes.map((type) => (
                                <Pressable
                                    key={type}
                                    style={[
                                        styles.typeButton,
                                        taskType === type && styles.typeButtonSelected,
                                    ]}
                                    onPress={() => setTaskType(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeButtonText,
                                            taskType === type && styles.typeButtonTextSelected,
                                        ]}
                                    >
                                        {type}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Input fields for the beginning and end of the task. */}
                        <Text style={styles.inputLabel}>Time period</Text>
                        <View style={styles.timeRow}>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.timeLabel}>Start time</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="09:00 AM"
                                    placeholderTextColor="#929A91"
                                    value={startTime}
                                    onChangeText={setStartTime}
                                    autoCapitalize="characters"
                                    maxLength={8}
                                />
                            </View>

                            <View style={styles.timeInputContainer}>
                                <Text style={styles.timeLabel}>End time</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="09:45 AM"
                                    placeholderTextColor="#929A91"
                                    value={endTime}
                                    onChangeText={setEndTime}
                                    autoCapitalize="characters"
                                    maxLength={8}
                                />
                            </View>
                        </View>

                        {/* Explain the time format expected by the form. */}
                        <Text style={styles.timeHint}>
                            Use a format like 09:00 AM or 02:30 PM.
                        </Text>

                        {/* Save the task to Firebase and show progress while saving. */}
                        <Pressable
                            style={[
                                styles.saveButton,
                                saving && styles.saveButtonDisabled,
                            ]}
                            onPress={addTask}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text style={styles.saveButtonText}>Save Task</Text>
                            )}
                        </Pressable>

                        {/* Close the form without saving a new task. */}
                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                            disabled={saving}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}

/* Define the styles for the dashboard, task cards, and form.
   Keeping styles together makes the design easier to maintain. */
const styles = StyleSheet.create({

    /* Main screen and scrolling layout. */
    container: {
        flex: 1,
        backgroundColor: "#F7F9F5",
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 35,
    },

    /* Header and app branding. */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    eyebrow: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.5,
        color: "#66806A",
        marginBottom: 5,
    },
    logo: {
        fontSize: 30,
        fontWeight: "800",
        color: "#263D2C",
    },
    logoAccent: {
        color: "#5C946A",
    },
    subtitle: {
        color: "#788177",
        fontSize: 12,
        marginTop: 3,
    },
    profileIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "#E5EDE1",
        alignItems: "center",
        justifyContent: "center",
    },
    profileText: {
        fontSize: 20,
    },

    /* Welcome card and its main action button. */
    heroCard: {
        backgroundColor: "#E6EFE1",
        borderRadius: 22,
        padding: 22,
        marginBottom: 28,
    },
    heroLabel: {
        color: "#55765B",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.2,
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 28,
        lineHeight: 34,
        fontWeight: "800",
        color: "#263D2C",
    },
    heroDescription: {
        color: "#637366",
        fontSize: 13,
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 18,
    },
    heroButton: {
        backgroundColor: "#477A58",
        borderRadius: 12,
        paddingVertical: 13,
        alignItems: "center",
    },
    heroButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },

    /* Today's Tasks heading and Add Task button. */
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    sectionTitle: {
        color: "#293B2C",
        fontSize: 20,
        fontWeight: "800",
    },
    sectionSubtitle: {
        color: "#879084",
        fontSize: 12,
        marginTop: 4,
    },
    addButton: {
        backgroundColor: "#477A58",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 11,
        fontWeight: "700",
    },

    /* Progress card and progress bar. */
    progressCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#EDF0EA",
    },
    progressTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 11,
    },
    progressText: {
        color: "#6F796D",
        fontSize: 12,
    },
    progressPercent: {
        color: "#477A58",
        fontSize: 12,
        fontWeight: "800",
    },
    progressTrack: {
        height: 7,
        backgroundColor: "#E9EEE6",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#6D9C70",
        borderRadius: 10,
    },

    /* Loading indicator and empty task list message. */
    loadingContainer: {
        padding: 25,
        alignItems: "center",
        gap: 10,
    },
    loadingText: {
        color: "#788177",
        fontSize: 12,
    },
    emptyCard: {
        backgroundColor: "#FFFFFF",
        padding: 25,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#EDF0EA",
    },
    emptyEmoji: {
        fontSize: 28,
        marginBottom: 8,
    },
    emptyTitle: {
        color: "#293B2C",
        fontSize: 16,
        fontWeight: "700",
    },
    emptyDescription: {
        color: "#879084",
        fontSize: 12,
        textAlign: "center",
        marginTop: 6,
    },

    /* Task card, checkbox, icon, and task details. */
    taskCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDF0EA",
    },
    completedTaskCard: {
        backgroundColor: "#F0F5ED",
        opacity: 0.85,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: "#C4CEC0",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },
    checkboxChecked: {
        backgroundColor: "#477A58",
        borderColor: "#477A58",
    },
    checkmark: {
        color: "#FFFFFF",
        fontWeight: "800",
        fontSize: 13,
    },
    taskIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#EFF4EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    taskEmoji: {
        fontSize: 19,
    },
    taskInfo: {
        flex: 1,
    },
    taskTitle: {
        color: "#293B2C",
        fontSize: 13,
        fontWeight: "700",
    },
    completedTaskTitle: {
        textDecorationLine: "line-through",
        color: "#8A9587",
    },
    taskType: {
        color: "#6A8B6A",
        fontSize: 11,
        marginTop: 4,
    },
    taskTime: {
        color: "#8A9287",
        fontSize: 11,
        marginTop: 5,
    },

    /* Workspace cards for the app's additional features. */
    workspaceHeading: {
        marginTop: 22,
    },
    workspaceCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#EDF0EA",
    },
    workspaceIcon: {
        width: 44,
        height: 44,
        borderRadius: 13,
        backgroundColor: "#EFF4EB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    workspaceEmoji: {
        fontSize: 20,
    },
    workspaceInfo: {
        flex: 1,
    },
    workspaceTitle: {
        color: "#293B2C",
        fontSize: 13,
        fontWeight: "700",
    },
    workspaceDescription: {
        color: "#879084",
        fontSize: 11,
        lineHeight: 16,
        marginTop: 4,
    },
    arrow: {
        fontSize: 25,
        color: "#91A18C",
        marginLeft: 8,
    },

    /* Study tip and footer. */
    tipCard: {
        backgroundColor: "#EEF2E7",
        borderRadius: 16,
        padding: 17,
        marginTop: 22,
    },
    tipTitle: {
        color: "#3C6445",
        fontSize: 13,
        fontWeight: "800",
        marginBottom: 7,
    },
    tipDescription: {
        color: "#697966",
        fontSize: 12,
        lineHeight: 19,
    },
    footer: {
        textAlign: "center",
        color: "#9AA294",
        fontSize: 10,
        marginTop: 25,
    },

    /* Background and layout of the Add Task popup. */
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(20, 35, 22, 0.4)",
        justifyContent: "flex-end",
    },
    modalCard: {
        backgroundColor: "#F9FAF7",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 22,
        paddingBottom: Platform.OS === "ios" ? 35 : 22,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 22,
    },
    modalTitle: {
        color: "#293B2C",
        fontSize: 23,
        fontWeight: "800",
    },
    modalSubtitle: {
        color: "#879084",
        fontSize: 12,
        marginTop: 5,
    },
    closeButton: {
        backgroundColor: "#EAEFE6",
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    closeButtonText: {
        color: "#536451",
        fontSize: 14,
    },

    /* Input fields and task type selection buttons. */
    inputLabel: {
        color: "#394B3A",
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#DDE5D8",
        borderRadius: 11,
        paddingHorizontal: 13,
        paddingVertical: 12,
        color: "#293B2C",
        fontSize: 13,
    },
    typeContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    typeButton: {
        borderWidth: 1,
        borderColor: "#DDE5D8",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#FFFFFF",
    },
    typeButtonSelected: {
        backgroundColor: "#E4EFE1",
        borderColor: "#477A58",
    },
    typeButtonText: {
        color: "#687366",
        fontSize: 11,
        fontWeight: "600",
    },
    typeButtonTextSelected: {
        color: "#376344",
        fontWeight: "800",
    },

    /* Start time and end time fields. */
    timeRow: {
        flexDirection: "row",
        gap: 10,
    },
    timeInputContainer: {
        flex: 1,
    },
    timeLabel: {
        color: "#879084",
        fontSize: 11,
        marginBottom: 6,
    },
    timeHint: {
        color: "#8A9287",
        fontSize: 10,
        marginTop: 7,
    },

    /* Save and Cancel buttons at the bottom of the form. */
    saveButton: {
        backgroundColor: "#477A58",
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: "center",
        marginTop: 22,
    },
    saveButtonDisabled: {
        opacity: 0.65,
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
    },
    cancelButton: {
        alignItems: "center",
        paddingVertical: 13,
        marginTop: 4,
    },
    cancelButtonText: {
        color: "#687366",
        fontSize: 13,
        fontWeight: "700",
    },
});
