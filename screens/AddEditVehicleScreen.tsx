import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useVehicles } from '../hooks/useFirestore';
import { uploadImage, deleteImage } from '../firebase/storage';
import { Vehicle } from '../models/Vehicle';

const AddEditVehicleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { vehicle } = route.params as { vehicle?: Vehicle };
  
  const isEditing = !!vehicle;
  const { addVehicle, updateVehicle } = useVehicles();

  const [make, setMake] = useState(vehicle?.make || '');
  const [model, setModel] = useState(vehicle?.model || '');
  const [year, setYear] = useState(vehicle?.year ? String(vehicle.year) : '');
  const [licensePlate, setLicensePlate] = useState(vehicle?.licensePlate || '');
  const [color, setColor] = useState(vehicle?.color || '');
  const [fuelType, setFuelType] = useState(vehicle?.fuelType || '');
  const [mileage, setMileage] = useState(vehicle?.mileage ? String(vehicle.mileage) : '');
  const [image, setImage] = useState(vehicle?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload a vehicle image');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSave = async () => {
    // Validate inputs
    if (!make || !model || !year || !licensePlate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(Number(year)) || Number(year) < 1900 || Number(year) > new Date().getFullYear() + 1) {
      Alert.alert('Error', 'Please enter a valid year');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = vehicle?.imageUrl || '';

      // Handle image upload if there's a new image
      if (image && image !== vehicle?.imageUrl) {
        const path = `vehicles/${Date.now()}.jpg`;
        imageUrl = await uploadImage(image, path, (progress) => {
          setUploadProgress(progress);
        });
        
        // Delete old image if we're updating
        if (isEditing && vehicle?.imageUrl) {
          try {
            await deleteImage(vehicle.imageUrl);
          } catch (error) {
            console.log('Error deleting old image', error);
            // Continue with the update even if the old image deletion fails
          }
        }
      }
      
      const vehicleData: Partial<Vehicle> = {
        make,
        model,
        year: Number(year),
        licensePlate,
        color: color || undefined,
        fuelType: fuelType || undefined,
        mileage: mileage ? Number(mileage) : undefined,
        imageUrl: image ? imageUrl : undefined,
      };

      if (isEditing && vehicle?.id) {
        await updateVehicle(vehicle.id, vehicleData);
        Alert.alert('Success', 'Vehicle updated successfully');
      } else {
        await addVehicle(vehicleData as any);
        Alert.alert('Success', 'Vehicle added successfully');
      }
      
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.imageContainer}>
          {image ? (
            <View>
              <Image source={{ uri: image }} style={styles.vehicleImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
              <Camera size={32} color="#94a3b8" />
              <Text style={styles.uploadText}>Upload Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Make *</Text>
          <TextInput
            style={styles.input}
            value={make}
            onChangeText={setMake}
            placeholder="e.g., Toyota"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Model *</Text>
          <TextInput
            style={styles.input}
            value={model}
            onChangeText={setModel}
            placeholder="e.g., Corolla"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Year *</Text>
          <TextInput
            style={styles.input}
            value={year}
            onChangeText={setYear}
            placeholder="e.g., 2020"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>License Plate *</Text>
          <TextInput
            style={styles.input}
            value={licensePlate}
            onChangeText={setLicensePlate}
            placeholder="e.g., ABC1234"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Color</Text>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={setColor}
            placeholder="e.g., Silver"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fuel Type</Text>
          <TextInput
            style={styles.input}
            value={fuelType}
            onChangeText={setFuelType}
            placeholder="e.g., Petrol, Diesel, Hybrid, Electric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Mileage (km)</Text>
          <TextInput
            style={styles.input}
            value={mileage}
            onChangeText={setMileage}
            placeholder="e.g., 25000"
            keyboardType="numeric"
          />
        </View>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
            <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>{isEditing ? 'Update Vehicle' : 'Add Vehicle'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  form: {
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  vehicleImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  uploadText: {
    color: '#64748b',
    marginTop: 8,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#334155',
  },
  input: {
    backgroundColor: '#fff',
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    fontSize: 16,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginVertical: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddEditVehicleScreen;