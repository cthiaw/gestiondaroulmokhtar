import { ReactNode } from 'react';

export interface User {
  id: number;
  username: string;
  password: string;
  role: 'superadmin' | 'admin' | 'user';
}

export interface Eleve {
  id: number;
  numeroImmatriculation: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  classeArabe: number;
  classeFrancais: number;
}

export interface Classe {
  id: number;
  nom: string;
  type: 'Arabe' | 'Français';
}

export interface Professeur {
  id: number;
  numeroImmatriculation: string;
  nom: string;
  prenom: string;
  matiere?: string;
  classeArabe?: number;
  classeFrancais?: number;
}

export interface Paiement {
  id: number;
  eleveId: number;
  date: string;
  montant: number;
  type: 'Inscription' | 'Mensualité' | 'Tenue';
  mois?: string;
}

export interface Depense {
  id: number;
  date: string;
  montant: number;
  categorie: 'Salaire' | 'Electricité' | 'Eau' | 'Personnel' | 'Autre';
  description: string;
  userId: number; // Add userId to track who made the expense
}

export interface DashboardItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}