import Dexie, { Table } from 'dexie';
import { User, Eleve, Professeur, Classe, Paiement, Depense } from '../types';

export class AppDatabase extends Dexie {
  users!: Table<User, number>;
  eleves!: Table<Eleve, number>;
  professeurs!: Table<Professeur, number>;
  classes!: Table<Classe, number>;
  paiements!: Table<Paiement, number>;
  depenses!: Table<Depense, number>;

  constructor() {
    super('DaroulMokhtarDB');
    this.version(1).stores({
      users: '++id, username, password, role',
      eleves: '++id, &numeroImmatriculation, nom, prenom, dateNaissance, classeArabe, classeFrancais',
      professeurs: '++id, &numeroImmatriculation, nom, prenom, matiere, classeArabe, classeFrancais',
      classes: '++id, nom, type',
      paiements: '++id, eleveId, date, montant, type, mois, description',
      depenses: '++id, date, montant, categorie, description'
    });

    // Désactive l'auto-ouverture de la base de données
    this.close();
  }

  async addEleve(eleve: Omit<Eleve, 'id'>) {
    try {
      const existingEleve = await this.eleves.where('numeroImmatriculation').equals(eleve.numeroImmatriculation).first();
      if (existingEleve) {
        throw new Error(`Un élève avec le numéro d'immatriculation ${eleve.numeroImmatriculation} existe déjà.`);
      }
      return await this.eleves.add(eleve);
    } catch (error) {
      throw error;
    }
  }

  async addProfesseur(professeur: Omit<Professeur, 'id'>) {
    try {
      const existingProf = await this.professeurs.where('numeroImmatriculation').equals(professeur.numeroImmatriculation).first();
      if (existingProf) {
        throw new Error(`Un professeur avec le numéro d'immatriculation ${professeur.numeroImmatriculation} existe déjà.`);
      }
      return await this.professeurs.add(professeur);
    } catch (error) {
      throw error;
    }
  }

  async updateEleve(id: number, eleve: Partial<Eleve>) {
    try {
      if (eleve.numeroImmatriculation) {
        const existingEleve = await this.eleves
          .where('numeroImmatriculation')
          .equals(eleve.numeroImmatriculation)
          .first();
        
        if (existingEleve && existingEleve.id !== id) {
          throw new Error(`Un élève avec le numéro d'immatriculation ${eleve.numeroImmatriculation} existe déjà.`);
        }
      }
      return await this.eleves.update(id, eleve);
    } catch (error) {
      throw error;
    }
  }

  async updateProfesseur(id: number, professeur: Partial<Professeur>) {
    try {
      if (professeur.numeroImmatriculation) {
        const existingProf = await this.professeurs
          .where('numeroImmatriculation')
          .equals(professeur.numeroImmatriculation)
          .first();
        
        if (existingProf && existingProf.id !== id) {
          throw new Error(`Un professeur avec le numéro d'immatriculation ${professeur.numeroImmatriculation} existe déjà.`);
        }
      }
      return await this.professeurs.update(id, professeur);
    } catch (error) {
      throw error;
    }
  }
}

export const db = new AppDatabase();

export async function initializeDatabase() {
  try {
    await db.open();

    // Initialisation des utilisateurs
    const userCount = await db.users.count();
    if (userCount === 0) {
      await db.users.add({
        username: 'admin',
        password: 'superadmin123',
        role: 'superadmin'
      });
    }

    // Initialisation des classes
    const classCount = await db.classes.count();
    if (classCount === 0) {
      const classesData = [
        { nom: 'PS', type: 'Français' },
        { nom: 'GS', type: 'Français' },
        { nom: 'CI', type: 'Français' },
        { nom: 'CP', type: 'Français' },
        { nom: 'CE1', type: 'Français' },
        { nom: 'CE2', type: 'Français' },
        { nom: 'CM1', type: 'Français' },
        { nom: 'CM2', type: 'Français' },
        { nom: 'PS', type: 'Arabe' },
        { nom: 'GS', type: 'Arabe' },
        { nom: 'CI', type: 'Arabe' },
        { nom: 'CP', type: 'Arabe' },
        { nom: 'CE1', type: 'Arabe' },
        { nom: 'CE2', type: 'Arabe' },
        { nom: 'CM1', type: 'Arabe' },
        { nom: 'CM2', type: 'Arabe' },
      ];
      await db.classes.bulkAdd(classesData);
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}