import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';


interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
}

const ReviewScreen: React.FC = () => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];

  // Mock data for October 13, 2025 (Monday)
  const today = new Date('2025-10-13');
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Rapat Tim', completed: true, priority: 'Tinggi' },
    { id: '2', title: 'Latihan Olahraga', completed: false, priority: 'Sedang' },
    { id: '3', title: 'Review Kode', completed: true, priority: 'Rendah' },
  ]);

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  const getPriorityColor = (priority: 'Rendah' | 'Sedang' | 'Tinggi') => {
    switch (priority) {
      case 'Rendah': return '#28a745';
      case 'Sedang': return '#fd7e14';
      case 'Tinggi': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap: 10}}>
        <IconSymbol name='doc.text.fill' size={40} color={colors.tint}/>
        <Text style={[styles.header, { color: colors.text }]}>
          Review Harian 
        </Text>
      </View>
      <Text style={[styles.today, { color: colors.secondaryText }]}>
        {today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Text>
      <Text style={[styles.subHeader, { color: colors.secondaryText }]}>
        Refleksi dan evaluasi tugas untuk hari ini
      </Text>

      {/* Summary Section */}
      <View style={[styles.summaryContainer, { backgroundColor: colors.card || colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Ringkasan Hari Ini</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Tugas Selesai</Text>
            <Text style={[styles.summaryValue, { color:  "#28a745" }]}>{completedTasks.length}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Tugas Tertunda</Text>
            <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{pendingTasks.length}</Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: colors.text }]}>Total Tugas</Text>
            <Text style={[styles.summaryValue, { color: colors.tint }]}>{tasks.length}</Text>
          </View>
        </View>
      </View>

      {/* Completed Tasks */}
      <View style={[styles.sectionContainer, { backgroundColor: colors.card || colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tugas Selesai</Text>
        {completedTasks.length === 0 ? (
          <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
            Tidak ada tugas selesai hari ini.
          </Text>
        ) : (
          completedTasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
              <Text style={[styles.taskPriority, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Pending Tasks */}
      <View style={[styles.sectionContainer, { backgroundColor: colors.card || colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Tugas Tertunda</Text>
        {pendingTasks.length === 0 ? (
          <Text style={[styles.placeholderText, { color: colors.secondaryText }]}>
            Tidak ada tugas tertunda hari ini.
          </Text>
        ) : (
          pendingTasks.map(task => (
            <View key={task.id} style={styles.taskItem}>
              <Text style={[styles.taskTitle, { color: colors.text }]}>{task.title}</Text>
              <Text style={[styles.taskPriority, { color: getPriorityColor(task.priority) }]}>
                {task.priority}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Reflection Section */}
      <View style={[styles.sectionContainer, { backgroundColor: colors.card || colors.background }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Catatan Refleksi</Text>
        <Text style={[styles.reflectionText, { color: colors.secondaryText }]}>
          Tulis refleksi Anda tentang produktivitas hari ini. Apa yang berhasil? Apa yang bisa diperbaiki?
        </Text>
        <TouchableOpacity style={styles.addNoteButton}>
          <Text style={[styles.addNoteText, { color: colors.tint }]}>+ Tambah Catatan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 16,
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#343a40',
  },
  taskTitle: {
    fontSize: 16,
  },
  today :{
    marginTop: 8,
  },
  taskPriority: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholderText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
  },
  reflectionText: {
    fontSize: 14,
    marginBottom: 12,
  },
  addNoteButton: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#007bff',
    alignItems: 'center',
  },
  addNoteText: {
    fontSize: 14,
  },
});

export default ReviewScreen;