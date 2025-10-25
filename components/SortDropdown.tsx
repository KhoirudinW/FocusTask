import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface SortOption {
  id: string;
  label: string;
  value: 'task-asc' | 'task-desc' | 'date-near' | 'date-far' | 'priority-low-high' | 'priority-high-low';
}

export interface SortDayOption {
  
  id: string;
  label: string;
  value: 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';
  
}

interface SortDropdownProps {
  selectedOption: SortOption;
  onOptionSelect: (option: SortOption) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ selectedOption, onOptionSelect }) => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions: SortOption[] = [
    {
      id: '1',
      label: 'Priority High to Low',
      value: 'priority-high-low',
    },
    {
      id: '2',
      label: 'Priority Low to High',
      value: 'priority-low-high',
    },
    {
      id: '3',
      label: 'Name A-Z',
      value: 'task-asc',
    },
    {
      id: '4',
      label: 'Name Z-A',
      value: 'task-desc',
    },
    {
      id: '5',
      label: 'Due Dates closest to now',
      value: 'date-near',
    },
    {
      id: '6',
      label: 'Due Dates farthest from now',
      value: 'date-far',
    },
  ];

  const sortDayOptions: SortDayOption[] = [
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
  

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: colors.tint }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={[styles.triggerText, { color: colors.text }]}>{selectedOption == null ? "Sort by ▼" : selectedOption.label + "▼"}</Text>
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.card }]}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.dropdownItem,
                option.value === selectedOption.value && styles.activeItem,
              ]}
              onPress={() => {
                onOptionSelect(option);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  option.value === selectedOption.value && styles.activeItemText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
    marginTop: 8,
  },
  trigger: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 16,
    fontWeight: '500',
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
    color: '#6b7280',
  },
  activeItemText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default SortDropdown;