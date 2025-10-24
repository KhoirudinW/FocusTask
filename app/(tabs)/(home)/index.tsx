import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import AddTaskModal from '@/components/AddTaskModal';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import 'react-native-get-random-values';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import SortDropdown, { SortOption } from '@/components/SortDropdown';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  time: Date;
  completed: boolean;
  date: Date; // For categorizing into tabs
}

const getPriorityColor = (priority: Task['priority']) => {
  switch (priority) {
    case 'Rendah':
      return 'green';
    case 'Sedang':
      return 'orange';
    case 'Tinggi':
      return 'red';
    default:
      return 'gray';
  }
};

// Fallback function if uuidv4 fails due to crypto issues
const generateSafeId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const HomeScreen: React.FC = () => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTab, setCurrentTab] = useState<'Hari Ini' | 'Besok' | 'Kemarin'>('Hari Ini');
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    id: '1',
    label: 'Priority High to Low',
    value: 'priority-high-low',
  });

  // Local date helpers
  const getToday = () => new Date();
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  };
  const getDayOfWeek = () => new Date().getDay();

  useEffect(() => {
    const today = getToday();
    const dayOfWeek = getDayOfWeek();
  
    const activePresets = [
      { 
        title: 'Meeting Harian', 
        description: 'Diskusi tim', 
        priority: 'Sedang' as const, 
        time: (() => {
          const t = new Date();
          t.setDate(t.getDate() + 1);
          return t;
        })(), 
        active: true 
      },
      { 
        title: 'Seharian rebahan', 
        description: 'Diskusi tim', 
        priority: 'Rendah' as const, 
        time: (() => {
          const t = new Date();
          t.setDate(t.getDate() + 1);
          return t;
        })(), 
        active: true 
      },
      { 
        title: 'Laporan Mingguan', 
        description: '', 
        priority: 'Tinggi' as const, 
        time: new Date(), 
        active: dayOfWeek === 1 
      },
      { 
        title: 'a test', 
        description: '', 
        priority: 'Tinggi' as const, 
        time:  (() => {
          const t = new Date();
          t.setDate(t.getDate() - 1);
          return t;
        })(),
        active: true
      },
      { 
        title: 'b test', 
        description: '', 
        priority: 'Sedang' as const, 
        time:  (() => {
          const t = new Date();
          t.setDate(t.getDate() - 1);
          return t;
        })(),
        active: true
      },
    ];

  
    activePresets.forEach((preset) => {
      const taskDate = new Date(preset.time);
      taskDate.setHours(0, 0, 0, 0);
  
      const exists = tasks.some(t => 
        t.title === preset.title && 
        new Date(t.date).toDateString() === taskDate.toDateString()
      );
  
      if (!exists && preset.active) {
        try {
          setTasks(prev => [...prev, {
            id: uuidv4(),
            title: preset.title,
            description: preset.description,
            priority: preset.priority,
            time: preset.time,
            completed: false,
            date: taskDate,
          }]);
        } catch {
          setTasks(prev => [...prev, {
            id: generateSafeId(),
            title: preset.title,
            description: preset.description,
            priority: preset.priority,
            time: preset.time,
            completed: false,
            date: taskDate,
          }]);
        }
      }
    });
  }, []); // Hanya sekali

  const getTabDate = () => {
    let date: Date;
    switch (currentTab) {
      case 'Hari Ini':
        date = getToday();
        break;
      case 'Besok':
        date = getTomorrow();
        break;
      case 'Kemarin':
        date = getYesterday();
        break;
      default:
        date = getToday();
    }
    date.setHours(0, 0, 0, 0); // Normalisasi ke tengah malam
    return date;
  };


  const filteredTasks = tasks.filter((task) => {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    const tabDate = getTabDate();
    return taskDate.toDateString() === tabDate.toDateString();
  }).sort((a, b) => {
    switch (sortOption.value) {
      case 'task-asc':
        return a.title.localeCompare(b.title);
      case 'task-desc':
        return b.title.localeCompare(a.title);
      case 'date-near':
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      case 'date-far':
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      case 'priority-low-high':
        const priorityOrder = { Rendah: 0, Sedang: 1, Tinggi: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'priority-high-low':
        const priorityOrderReverse = { Rendah: 2, Sedang: 1, Tinggi: 0 };
        return priorityOrderReverse[a.priority] - priorityOrderReverse[b.priority];
      default:
        return 0;
    }
  });

  // console.log(filteredTasks)

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.length - tasks.filter((t) => t.completed).length,
  };

  const handleAddTask = (taskData: { 
    title: string; 
    description: string; 
    priority: 'Rendah' | 'Sedang' | 'Tinggi'; 
    time: Date;
    date: Date; // TERIMA DATE
  }) => {
    try {
      setTasks((prev) => [
        ...prev,
        {
          id: uuidv4(),
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          time: taskData.time,
          completed: false,
          date: taskData.date, // GUNAKAN DATE DARI MODAL
        },
      ]);
    } catch (error) {
      console.warn('uuidv4 failed:', error);
      setTasks((prev) => [
        ...prev,
        {
          id: generateSafeId(),
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          time: taskData.time,
          completed: false,
          date: taskData.date,
        },
      ]);
    }
    setModalVisible(false);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleDragEnd = ({ data }: { data: Task[] }) => {
    setTasks(data);
  };

  const renderTask = ({ item, drag, isActive }: { item: Task; drag: () => void; isActive: boolean }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[styles.taskItem, { opacity: isActive ? 0.5 : 1, backgroundColor: colors.card }]}
      >
        <TouchableOpacity onPress={() => toggleTaskStatus(item.id)}>
        {currentTab !== 'Kemarin' && (
          <Text style={[styles.checkbox, { color: colors.text }]}>{item.completed ? '✓' : '□'}</Text>
        )}
        </TouchableOpacity>
        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.taskDescription, { color: colors.secondaryText }]}>{item.description}</Text>
          <View style={styles.taskFooter}>
            <View style={styles.priorityContainer}>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
              <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
            </View>
            <Text style={[styles.taskTime, { color: colors.secondaryText }]}>
              {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => deleteTask(item.id)}>
          <Text style={[styles.deleteIcon, { color: '#dc3545' }]}>🗑️</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <IconSymbol name="house.fill" size={40} color={colors.tint} />
          <Text style={[styles.header, { color: colors.text }]}>Dashboard</Text>
        </View>
        <Text style={[styles.subHeader, { color: colors.secondaryText }]}>Kelola tugas harian Anda dengan efisien</Text>
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Total</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{stats.total}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Selesai</Text>
            <Text style={[styles.statValueSelesai, { color: '#28a745' }]}>{stats.completed}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Pending</Text>
            <Text style={[styles.statValuePending, { color: '#fd7e14' }]}>{stats.pending}</Text>
          </View>
        </View>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, currentTab === 'Hari Ini' && styles.activeTab]}
            onPress={() => setCurrentTab('Hari Ini')}
          >
            <Text style={[styles.tabText, currentTab === 'Hari Ini' && styles.activeTabText]}>Hari Ini</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, currentTab === 'Besok' && styles.activeTab]}
            onPress={() => setCurrentTab('Besok')}
          >
            <Text style={[styles.tabText, currentTab === 'Besok' && styles.activeTabText]}>Besok</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, currentTab === 'Kemarin' && styles.activeTab]}
            onPress={() => setCurrentTab('Kemarin')}
          >
            <Text style={[styles.tabText, currentTab === 'Kemarin' && styles.activeTabText]}>Kemarin</Text>
          </TouchableOpacity>
        </View>
        <SortDropdown
          selectedOption={sortOption}
          onOptionSelect={setSortOption}
        />
        {filteredTasks.length === 0 ? (
          <Text style={[styles.noTasks, { color: colors.secondaryText }]}>Belum ada tugas. Tambahkan tugas baru!</Text>
        ) : (
          <DraggableFlatList
            data={filteredTasks}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={renderTask}
          />
        )}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTask}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statBox: {
    padding: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statValueSelesai: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statValuePending: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#151621',
    padding: 0,
    borderRadius: 100,
  },
  tab: {
    width: '33.3%',
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007bff',
    borderColor: '#054f9e',
  },
  tabText: {
    textAlign: 'center',
    color: 'gray',
  },
  activeTabText: {
    color: 'white',
  },
  noTasks: {
    textAlign: 'center',
    marginTop: 32,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  checkbox: {
    fontSize: 20,
    marginRight: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: 'bold',
  },
  taskDescription: {},
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 12,
  },
  taskTime: {},
  deleteIcon: {
    fontSize: 20,
    color: 'red',
    marginLeft: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: '#007bff',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 32,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default HomeScreen;