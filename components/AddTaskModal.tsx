import { Colors } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (task: {
    title: string;
    description: string;
    priority: 'Rendah' | 'Sedang' | 'Tinggi';
    time: Date;
    date: Date
  }) => void;
  isPreset :  boolean;
}

export interface SortOption {
  id: string;
  label: string;
  value: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';
}

const sortOptions: SortOption[] = [
  {
    id: '1',
    label: 'Senin',
    value: 'senin',
  },
  {
    id: '2',
    label: 'Selasa',
    value: 'selasa',
  },
  {
    id: '3',
    label: 'Rabu',
    value: 'rabu',
  },
  {
    id: '4',
    label: 'Kamis',
    value: 'kamis',
  },
  {
    id: '5',
    label: 'Jumat',
    value: 'jumat',
  },
  {
    id: '6',
    label: 'Sabtu',
    value: 'sabtu',
  },
  {
    id: '7',
    label: 'Minggu',
    value: 'minggu',
  },
];

const AddTaskModal: React.FC<AddTaskModalProps> = ({ visible, onClose, onAdd, isPreset}) => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<'Rendah' | 'Sedang' | 'Tinggi'>('Sedang');
  const [newTime, setNewTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<'Hari Ini' | 'Besok'>('Hari Ini');
  const [isOpen, setIsOpen] = useState(false);
  const [daySelectedLabel, setDaySelectedLabel] = useState("Senin");


  const handleDayToggle = (day: 'Hari Ini' | 'Besok') => {
    setSelectedDay(day);
    const updatedDate = new Date(newTime);
    const currentHours = updatedDate.getHours();
    const currentMinutes = updatedDate.getMinutes();
  
    if (day === 'Besok') {
      updatedDate.setDate(updatedDate.getDate() + 1);
    } else {
      updatedDate.setDate(new Date().getDate());
    }
  
    // Kembalikan jam & menit
    updatedDate.setHours(currentHours, currentMinutes, 0, 0);
    setNewTime(updatedDate);
  };

  

  const addTask = () => {
    if (!newTitle.trim()) return;
  
    const taskDate = new Date(newTime);
    taskDate.setHours(0, 0, 0, 0); // Normalize ke tengah malam
  
    onAdd({
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      time: newTime,
      date: taskDate, // Kirim date dari modal
    });
  
    // Reset
    setNewTitle('');
    setNewDescription('');
    setNewPriority('Sedang');
    setNewTime(new Date());
    setSelectedDay('Hari Ini');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tambah Tugas Baru</Text>
          <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
            Buat tugas baru dan atur prioritasnya
          </Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            placeholderTextColor={colors.secondaryText}
            placeholder="Masukkan judul tugas..."
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <TextInput
            style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: colors.card, color: colors.text }]}
            placeholderTextColor={colors.secondaryText}
            placeholder="Deskripsi singkat..."
            value={newDescription}
            onChangeText={setNewDescription}
            multiline
          />
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Prioritas:</Text>
            <TouchableOpacity onPress={() => setNewPriority('Rendah')}>
              <Text style={newPriority === 'Rendah' ? [styles.selected, { color: colors.text, backgroundColor: "green" }] : styles.option}>Rendah</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewPriority('Sedang')}>
              <Text style={newPriority === 'Sedang' ? [styles.selected, { color: colors.text, backgroundColor: "orange" }] : styles.option}>Sedang</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setNewPriority('Tinggi')}>
              <Text style={newPriority === 'Tinggi' ? [styles.selected, { color: colors.text, backgroundColor: "red" }] : styles.option}>Tinggi</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.secondaryText }]}>Waktu:</Text>
            <View style={styles.dayTimeContainer}>
              {isPreset == false ? (
                <View style={styles.dayToggle}>
                  <TouchableOpacity
                    style={[styles.dayButton, selectedDay === 'Hari Ini' && styles.activeDayButton]}
                    onPress={() => handleDayToggle('Hari Ini')}
                  >
                    <Text style={[styles.dayText, selectedDay === 'Hari Ini' && styles.activeDayText]}>Hari Ini</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dayButton, selectedDay === 'Besok' && styles.activeDayButton]}
                    onPress={() => handleDayToggle('Besok')}
                  >
                    <Text style={[styles.dayText, selectedDay === 'Besok' && styles.activeDayText]}>Besok</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={[styles.daySelection, styles.selected]}
                    onPress={() => {
                      setIsOpen(!isOpen);
                    }}
                  >
                    <Text style={[styles.daySelectionText]}>{daySelectedLabel}</Text>
                  </TouchableOpacity>
                  {isOpen == true ? (
                    <View style={[styles.dropdown, { backgroundColor: colors.card }]}>
                      {sortOptions.map((option) => (
                        <TouchableOpacity
                          key={option.id}
                          style={[
                            styles.dropdownItem,
                            option.label === daySelectedLabel && styles.activeItem,
                          ]}
                          onPress={() => {
                            setDaySelectedLabel(option.label);
                            setIsOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              option.label === daySelectedLabel && styles.activeItemText,
                            ]}
                          >
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (null)}
                </View>
              )}
              <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                <Text style={[styles.timeText, { color: colors.text }]}>
                  {newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {showTimePicker && (
            <DateTimePicker
              value={newTime}
              mode="time"
              is24Hour
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedDate) setNewTime(selectedDate);
              }}
            />
          )}
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.card }]}
              onPress={onClose} // Use onClose instead of setModalVisible
            >
              <Text style={[styles.buttonText, { color: '#dc3545' }]}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addModalButton, { backgroundColor: colors.tint }]}
              onPress={addTask}
            >
              <Text style={[styles.addModalButtonText, { color: colors.text }]}>Tambah</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#343a40',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  option: {
    fontSize: 16,
    padding: 8,
    marginRight: 8,
    color: '#adb5bd',
  },
  selected: {
    fontSize: 16,
    padding: 8,
    marginRight: 8,
    // backgroundColor: '#007bff',
    borderRadius: 4,
    color: '#fff',
  },
  timeText: {
    fontSize: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#343a40',
    borderRadius: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  addModalButton: {
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  addModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dayTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  dayToggle: {
    flexDirection: 'row',
    marginRight: 10,
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2a2a3f',
    marginRight: 5,
  },
  activeDayButton: {
    backgroundColor: '#007bff',
  },
  dayText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeDayText: {
    color: 'white',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    paddingBottom: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  activeItem: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  dropdownItemText: {
    fontSize: 16,
    color: 'white',
  },
  activeItemText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  daySelection: {
    paddingVertical: 6,
    width: 200,
    borderRadius: 8,
    backgroundColor: '#007bff',
    marginRight: 5,
  },
  daySelectionText:{
    color: 'white'
  } 
});

export default AddTaskModal;