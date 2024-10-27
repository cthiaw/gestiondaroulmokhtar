import React, { useState, useEffect } from 'react';
import { Professeur, Classe } from '../types';

interface FormulaireProfesseurProps {
  professeur?: Professeur;
  classes: Classe[];
  onSubmit: (professeur: Omit<Professeur, 'id'>) => void;
  onCancel: () => void;
}

export const FormulaireProfesseur: React.FC<FormulaireProfesseurProps> = ({ professeur, classes, onSubmit, onCancel }) => {
  const [numeroImmatriculation, setNumeroImmatriculation] = useState(professeur?.numeroImmatriculation || '');
  const [nom, setNom] = useState(professeur?.nom || '');
  const [prenom, setPrenom] = useState(professeur?.prenom || '');
  const [matiere, setMatiere] = useState(professeur?.matiere || '');
  const [classeArabe, setClasseArabe] = useState<string | undefined>(professeur?.classeArabe?.toString() || undefined);
  const [classeFrancais, setClasseFrancais] = useState<string | undefined>(professeur?.classeFrancais?.toString() || undefined);

  useEffect(() => {
    if (professeur) {
      setNumeroImmatriculation(professeur.numeroImmatriculation);
      setNom(professeur.nom);
      setPrenom(professeur.prenom);
      setMatiere(professeur.matiere || '');
      setClasseArabe(professeur.classeArabe?.toString());
      setClasseFrancais(professeur.classeFrancais?.toString());
    }
  }, [professeur]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numeroImmatriculation,
      nom,
      prenom,
      matiere: matiere || undefined,
      classeArabe: classeArabe ? parseInt(classeArabe) : undefined,
      classeFrancais: classeFrancais ? parseInt(classeFrancais) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label htmlFor="numeroImmatriculation" className="block text-sm font-medium text-gray-700">
          Numéro d'immatriculation
        </label>
        <input
          type="text"
          id="numeroImmatriculation"
          value={numeroImmatriculation}
          onChange={(e) => setNumeroImmatriculation(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom
        </label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
          Prénom
        </label>
        <input
          type="text"
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="matiere" className="block text-sm font-medium text-gray-700">
          Matière <span className="text-gray-500">(optionnel)</span>
        </label>
        <input
          type="text"
          id="matiere"
          value={matiere}
          onChange={(e) => setMatiere(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label htmlFor="classeArabe" className="block text-sm font-medium text-gray-700">
          Classe Arabe
        </label>
        <select
          id="classeArabe"
          value={classeArabe || ''}
          onChange={(e) => setClasseArabe(e.target.value || undefined)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Sélectionnez une classe arabe</option>
          {classes.filter(c => c.type === 'Arabe').map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="classeFrancais" className="block text-sm font-medium text-gray-700">
          Classe Français
        </label>
        <select
          id="classeFrancais"
          value={classeFrancais || ''}
          onChange={(e) => setClasseFrancais(e.target.value || undefined)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Sélectionnez une classe française</option>
          {classes.filter(c => c.type === 'Français').map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {professeur ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default FormulaireProfesseur;