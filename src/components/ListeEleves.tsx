import React, { useState } from 'react';
import { Eleve, Classe } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { FormulaireEleve } from './FormulaireEleve';
import { Alert } from './ui/Alert';

interface ListeElevesProps {
  eleves: Eleve[];
  classes: Classe[];
  onAddEleve: (eleve: Omit<Eleve, 'id'>) => void;
  onUpdateEleve: (id: number, eleve: Omit<Eleve, 'id'>) => void;
  onDeleteEleve: (id: number) => void;
}

export const ListeEleves: React.FC<ListeElevesProps> = ({ eleves, classes, onAddEleve, onUpdateEleve, onDeleteEleve }) => {
  const [editingEleve, setEditingEleve] = useState<Eleve | null>(null);
  const [isAddingEleve, setIsAddingEleve] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (eleve: Eleve) => {
    setEditingEleve(eleve);
    setIsAddingEleve(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) {
      onDeleteEleve(id);
    }
  };

  const handleSubmit = async (eleve: Omit<Eleve, 'id'>) => {
    try {
      if (editingEleve) {
        await onUpdateEleve(editingEleve.id, eleve);
        setEditingEleve(null);
      } else {
        await onAddEleve(eleve);
        setIsAddingEleve(false);
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
    setIsAddingEleve(false);
    setEditingEleve(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Liste des Élèves</h2>
      <button
        onClick={() => { setIsAddingEleve(true); setEditingEleve(null); }}
        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Ajouter un élève
      </button>

      {error && (
        <Alert
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      {(isAddingEleve || editingEleve) && (
        <FormulaireEleve
          eleve={editingEleve || undefined}
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
            <TableHead>Date de naissance</TableHead>
            <TableHead>Classes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eleves.map((eleve) => (
            <TableRow key={eleve.id}>
              <TableCell>{eleve.numeroImmatriculation}</TableCell>
              <TableCell>{eleve.nom}</TableCell>
              <TableCell>{eleve.prenom}</TableCell>
              <TableCell>{eleve.dateNaissance}</TableCell>
              <TableCell>
                {classes.find(c => c.id === eleve.classeArabe)?.nom} (Arabe) / {classes.find(c => c.id === eleve.classeFrancais)?.nom} (Français)
              </TableCell>
              <TableCell>
                <button onClick={() => handleEdit(eleve)} className="mr-2 text-blue-600 hover:text-blue-800">
                  Modifier
                </button>
                <button onClick={() => handleDelete(eleve.id)} className="text-red-600 hover:text-red-800">
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

export default ListeEleves;