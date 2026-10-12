import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const STORAGE_KEY = 'study_planner_subjects';

const defaultSubjects = [
    { id: 1, name: 'Math', emoji: '📐', done: false },
    { id: 2, name: 'React Native', emoji: '💻', done: false },
    { id: 3, name: 'Chemistry', emoji: '🧪', done: false },
];

export default function Dashboard() {
    const [subjects, setSubjects] = useState(defaultSubjects);
    const [newSubject, setNewSubject] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        loadSubjects();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
    }, [subjects]);

    async function loadSubjects() {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
            setSubjects(JSON.parse(saved));
        }
    }

    function toggleDone(id: number) {
        setSubjects((prev) =>
            prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
        );
    }

    function addSubject() {
        if (newSubject.trim() === '') return;
        const newItem = {
            id: Date.now(),
            name: newSubject.trim(),
            emoji: '📘',
            done: false,
        };
        setSubjects((prev) => [...prev, newItem]);
        setNewSubject('');
    }

    function deleteSubject(id: number) {
        setSubjects((prev) => prev.filter((s) => s.id !== id));
    }

    const completedCount = subjects.filter((s) => s.done).length;
    const percent =
        subjects.length === 0
            ? 0
            : Math.round((completedCount / subjects.length) * 100);

    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.headerRow}>
                <Text style={[styles.title, { color: theme.text }]}>Study Planner</Text>
                <Pressable onPress={() => setDarkMode((d) => !d)}>
                    <Text style={styles.themeToggle}>{darkMode ? '☀️' : '🌙'}</Text>
                </Pressable>
            </View>

            <Text style={[styles.progress, { color: theme.subtext }]}>
                {completedCount} of {subjects.length} completed · {percent}%
            </Text>

            <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
            </View>

            <FlatList
                data={subjects}
                keyExtractor={(item) => item.id.toString()}
                style={{ marginTop: 16 }}
                renderItem={({ item }) => (
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Pressable
                            style={styles.cardMain}
                            onPress={() => toggleDone(item.id)}
                        >
                            <Text style={styles.emoji}>{item.emoji}</Text>
                            <Text
                                style={[
                                    styles.name,
                                    { color: theme.text },
                                    item.done && styles.nameDone,
                                ]}
                            >
                                {item.name}
                            </Text>
                            <View style={[styles.badge, item.done && styles.badgeDone]}>
                                <Text style={styles.badgeText}>
                                    {item.done ? '✓ Done' : 'Mark Done'}
                                </Text>
                            </View>
                        </Pressable>

                        <Pressable onPress={() => deleteSubject(item.id)}>
                            <Text style={styles.deleteText}>✕</Text>
                        </Pressable>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={{ color: theme.subtext, marginTop: 20 }}>
                        No subjects yet — add one below.
                    </Text>
                }
            />

            <View style={styles.addRow}>
                <TextInput
                    style={[styles.input, { color: theme.text, borderColor: theme.subtext }]}
                    placeholder="Add a subject..."
                    placeholderTextColor={theme.subtext}
                    value={newSubject}
                    onChangeText={setNewSubject}
                    onSubmitEditing={addSubject}
                />
                <Pressable style={styles.addButton} onPress={addSubject}>
                    <Text style={styles.addButtonText}>+ Add</Text>
                </Pressable>
            </View>
        </View>
    );
}

const lightTheme = {
    background: '#f5f6fa',
    card: '#ffffff',
    text: '#1a1a2e',
    subtext: '#6b7280',
};

const darkTheme = {
    background: '#121212',
    card: '#1e1e1e',
    text: '#f5f5f5',
    subtext: '#9ca3af',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    themeToggle: {
        fontSize: 22,
    },
    progress: {
        fontSize: 14,
        marginTop: 4,
    },
    progressBarTrack: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e5e7eb',
        marginTop: 8,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 8,
        backgroundColor: '#22c55e',
        borderRadius: 4,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    cardMain: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 22,
        marginRight: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    nameDone: {
        textDecorationLine: 'line-through',
        opacity: 0.5,
    },
    badge: {
        backgroundColor: '#e5e7eb',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    badgeDone: {
        backgroundColor: '#22c55e',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    deleteText: {
        fontSize: 18,
        color: '#ef4444',
        marginLeft: 12,
        paddingHorizontal: 4,
    },
    addRow: {
        flexDirection: 'row',
        marginTop: 12,
        marginBottom: 20,
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#2563eb',
        borderRadius: 10,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});