import React from 'react';
import ProfileClient from '../components/clients/profile'; // Check this path matches your folder structure

export const metadata = {
  title: 'My Profile | Dej Carving',
  description: 'Manage your account and view orders.',
};

export default function ProfilePage() {
  return <ProfileClient />;
}