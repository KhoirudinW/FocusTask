import React, { useState } from 'react';
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/hooks/use-auth';
import { IconSymbol } from '@/components/ui/icon-symbol';
// import Icon from 'react-native-vector-icons/MaterialIcons'; // For icons

const ProfileScreen: React.FC = () => {
  const colorScheme = 'dark';
  const colors = Colors[colorScheme];
  const { logout } = useAuth();

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [bio, setBio] = useState('A passionate developer working on FocusTask.');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save changes (e.g., to a store or API)
  };

  const handleLogout = async () => {
    try {
      await logout(); // dari useAuth
      router.replace('/(auth)'); // atau '/(auth)/index'
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <IconSymbol name="person.fill" size={40} color={colors.tint} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profil</Text>
      </View>
      <Text style={{ color: colors.secondaryText , fontSize: 14, marginBottom: 16}}>Kelola tugas harian Anda dengan efisien</Text>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }} // Replace with user avatar URL
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.email, { color: colors.secondaryText }]}>{email}</Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>Nama</Text>
          {isEditing ? (
            <TextInput
              value={name}
              onChangeText={setName}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              autoCorrect={false}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{name}</Text>
          )}
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>Email</Text>
          {isEditing ? (
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              autoCorrect={false}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{email}</Text>
          )}
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>Bio</Text>
          {isEditing ? (
            <TextInput
              value={bio}
              onChangeText={setBio}
              style={[styles.input, { height: 80, textAlignVertical: 'top', backgroundColor: colors.card, color: colors.text }]}
              multiline
              autoCorrect={false}
            />
          ) : (
            <Text style={[styles.value, { color: colors.text }]}>{bio}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={[styles.editButtonText, { color: isEditing ? colors.text : colors.tint }]}>
            {isEditing ? 'Batal' : 'Edit Profil'}
          </Text>
        </TouchableOpacity>
        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={[styles.saveButtonText, { color: colors.text }]}>Simpan</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: '#dc3545' }]}>Keluar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: "blue",
    height: "50%",
    borderRadius: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  section: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  field: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#343a40',
    borderRadius: 4,
    padding: 8,
  },
  editButton: {
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 4,
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;