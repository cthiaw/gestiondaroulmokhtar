import React, { useState } from 'react';
import { Professeur, Classe } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FormulaireProfesseur } from './FormulaireProfesseur';
import { Alert } from './ui/Alert';

interface ListeProfesseursProps {
  professeurs: Professeur[];
  classes: Classe[];
  onAddProfesseur: (professeur: Omit<Professeur, 'id'>) => void;
  onUpdateProfesseur: (id: number, professeur: Omit<Professeur, 'id'>) => void;
  onDeleteProfesseur: (id: number) => void;
}

export const ListeProfesseurs: React.FC<ListeProfesseursProps> = ({ 
  professeurs, 
  classes, 
  onAddProfesseur, 
  onUpdateProfesseur, 
  onDeleteProfesseur 
}) => {
  const [editingProfesseur, setEditingProfesseur] = useState<Professeur | null>(null);
  const [isAddingProfesseur, setIsAddingProfesseur] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (professeur: Professeur) => {
    setEditingProfesseur(professeur);
    setIsAddingProfesseur(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) {
      onDeleteProfesseur(id);
    }
  };

  const handleSubmit = async (professeur: Omit<Professeur, 'id'>) => {
    try {
      if (editingProfesseur) {
        await onUpdateProfesseur(editingProfesseur.id, professeur);
        setEditingProfesseur(null);
      } else {
        await onAddProfesseur(professeur);
        setIsAddingProfesseur(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Une erreur s'est produite lors de l'opération");
      }
    }
  };

  const handleCancel = () => {
    setIsAddingProfesseur(false);
    setEditingProfesseur(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Professeurs</h2>
      <button
        onClick={() => { setIsAddingProfesseur(true); setEditingProfesseur(null); }}
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter un professeur
      </button>

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {(isAddingProfesseur || editingProfesseur) && (
        <FormulaireProfesseur
          professeur={editingProfesseur || undefined}
          classes={classes}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Immatriculation</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Matière</TableHead>
            <TableHead>Classe Arabe</TableHead>
            <TableHead>Classe Français</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professeurs.map((professeur) => (
            <TableRow key={professeur.id}>
              <TableCell>{professeur.numeroImmatriculation}</TableCell>
              <TableCell>{professeur.nom}</TableCell>
              <TableCell>{professeur.prenom}</TableCell>
              <TableCell>{professeur.matiere}</TableCell>
              <TableCell>{classes.find(c => c.id === professeur.classeArabe)?.nom || '-'}</TableCell>
              <TableCell>{classes.find(c => c.id === professeur.classeFrancais)?.nom || '-'}</TableCell>
              <TableCell>
                <button onClick={() => handleEdit(professeur)} className="mr-2 text-blue-600 hover:text-blue-800">
                  Modifier
                </button>
                <button onClick={() => handleDelete(professeur.id)} className="text-red-600 hover:text-red-800">
                  Supprimer
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ListeProfesseurs;