import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, FlatList, Switch, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { v4 as uuidv4 } from 'uuid'; // Install uuid: npm install uuid @types/uuid
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import AddTaskModal from '@/components/AddTaskModal';
import SortDropdown, {SortOption} from '@/components/SortDropdown';



interface Preset {
  id: string;
  title: string;
  description: string;
  day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu' | 'Minggu';
  time: Date;
  priority: 'Rendah' | 'Sedang' | 'Tinggi';
  active: boolean;
}

const PresetScreen: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDay, setNewDay] = useState<Preset['day']>('Senin');
  const [newTime, setNewTime] = useState(new Date());
  const [newPriority, setNewPriority] = useState<Preset['priority']>('Sedang');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>({
    id: '1',
    label: 'Priority High to Low',
    value: 'priority-high-low',
  });

  const colorScheme = 'dark';
  const colors = Colors[colorScheme];

  const addPreset = () => {
    if (!newTitle.trim()) {
      Alert.alert('Error', 'Judul preset harus diisi.');
      return;
    }
    const newPreset: Preset = {
      id: uuidv4(),
      title: newTitle,
      description: newDescription,
      day: newDay,
      time: newTime,
      priority: newPriority,
      active: true,
    };
    setPresets([...presets, newPreset]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewDay('Senin');
    setNewTime(new Date());
    setNewPriority('Sedang');
  };

  const toggleActive = (id: string) => {
    setPresets(
      presets.map((preset) =>
        preset.id === id ? { ...preset, active: !preset.active } : preset
      )
    );
  };

  const deletePreset = (id: string) => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus preset ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        onPress: () => setPresets(presets.filter((preset) => preset.id !== id)),
      },
    ]);
  };

  const renderPreset = ({ item }: { item: Preset }) => (
    <View style={styles.presetItem}>
      <View style={styles.presetHeader}>
        <Text style={styles.presetDay}>{item.day}</Text>
        <Text style={styles.presetCount}>{presets.filter(p => p.day === item.day && p.active).length}</Text>
      </View>
      <View style={styles.presetContent}>
        <Text style={styles.presetTitle}>{item.title}</Text>
        <Text style={styles.presetDescription}>{item.description}</Text>
        <View style={styles.presetFooter}>
          <Text style={[styles.presetPriority, { color: getPriorityColor(item.priority) }]}>
            {item.priority}
          </Text>
          <Text style={styles.presetTime}>
            {item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
      <View style={styles.presetActions}>
        <Switch
          onValueChange={() => toggleActive(item.id)}
          value={item.active}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={item.active ? '#f5dd4b' : '#f4f3f4'}
        />
        <TouchableOpacity onPress={() => deletePreset(item.id)}>
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getPriorityColor = (priority: Preset['priority']) => {
    switch (priority) {
      case 'Rendah': return 'green';
      case 'Sedang': return 'orange';
      case 'Tinggi': return 'red';
      default: return 'gray';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{display: 'flex', flexDirection:'row', alignItems: 'center', gap: 10}}>
        <IconSymbol name='calendar.fill' size={40} color={colors.tint}/>
        <Text style={styles.header}>Preset Tugas</Text>
      </View>
      <Text style={styles.subHeader}>
        Atur tugas otomatis untuk hari tertentu dalam seminggu
      </Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Preset</Text>
          <Text style={styles.statValue}>{presets.length}</Text>
        </View>
        <View style={[styles.statBox, styles.statActive]}>
          <Text style={styles.statLabel}>Aktif</Text>
          <Text style={styles.statValue}>{presets.filter(p => p.active).length}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ Tambah Preset</Text>
        </TouchableOpacity>
      </View>
      <SortDropdown selectedOption={sortOption} onOptionSelect={setSortOption}/>
      {presets.length === 0 ? (
        <View style={styles.noPresetsContainer}>
          <IconSymbol name='calendar.fill' size={60} color={"gray"}></IconSymbol>
          <Text style={styles.noPresetsText}>Belum ada preset. Buat preset pertama Anda!</Text>
          <TouchableOpacity style={styles.createPresetButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.createPresetButtonText}>+ Tambah Preset</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={presets}
          renderItem={renderPreset}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.presetList}
        />
      )}
      <AddTaskModal visible={modalVisible} onClose={() => setModalVisible(false)} onAdd={addPreset} isPreset={true}/>
    
    </View>
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
    color: 'white',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a3f',
    padding: 12,
    borderRadius: 8,
  },
  statBox: {
    alignItems: 'center',
  },
  statActive: {
    marginHorizontal: 16,
  },
  statLabel: {
    color: 'gray',
    fontSize: 12,
  },
  statValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
  },
  noPresetsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPresetsIcon: {
    fontSize: 40,
    color: 'gray',
    marginBottom: 16,
  },
  noPresetsText: {
    color: 'gray',
    textAlign: 'center',
    marginBottom: 16,
  },
  createPresetButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  createPresetButtonText: {
    color: 'white',
    fontSize: 14,
  },
  presetList: {
    paddingTop: 16,
  },
  presetItem: {
    backgroundColor: '#2a2a3f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  presetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  presetDay: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  presetCount: {
    color: 'gray',
    fontSize: 12,
  },
  presetContent: {
    flex: 1,
    marginLeft: 8,
  },
  presetTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  presetDescription: {
    color: 'gray',
    fontSize: 12,
  },
  presetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  presetPriority: {
    fontSize: 12,
  },
  presetTime: {
    color: 'gray',
    fontSize: 12,
  },
  presetActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 18,
    color: 'red',
    marginLeft: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2a2a3f',
    padding: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1e1e2f',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    color: 'gray',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#2a2a3f',
    color: 'white',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    color: 'white',
    flex: 1,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#2a2a3f',
    borderRadius: 4,
  },
  picker: {
    color: 'white',
    height: 40,
  },
  timeText: {
    color: 'white',
    backgroundColor: '#2a2a3f',
    padding: 8,
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  addModalButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  addModalButtonText: {
    color: 'white',
  },
  selected: {
    color: 'white',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  option: {
    color: 'gray',
    marginHorizontal: 8,
  },
});

export default PresetScreen;