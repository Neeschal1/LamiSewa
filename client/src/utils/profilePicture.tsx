import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfilePicture = async (imageUri: string): Promise<string | null> => {
  const cloudName = `${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}`;
  const uploadPreset = `${process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`;;

  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    console.log('Cloudinary response:', JSON.stringify(data));
    return data.secure_url ?? null;
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
};

export default ProfilePicture