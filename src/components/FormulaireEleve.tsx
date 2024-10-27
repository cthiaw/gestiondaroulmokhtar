import React, { useState, useEffect } from 'react';
import { Eleve, Classe } from '../types';

interface FormulaireEleveProps {
  eleve?: Eleve;
  classes: Classe[];
  onSubmit: (eleve: Omit<Eleve, 'id'>) => void;
  onCancel: () => void;
}

export const FormulaireEleve: React.FC<FormulaireEleveProps> = ({ eleve, classes, onSubmit, onCancel }) => {
  const [numeroImmatriculation, setNumeroImmatriculation] = useState(eleve?.numeroImmatriculation || '');
  const [nom, setNom] = useState(eleve?.nom || '');
  const [prenom, setPrenom] = useState(eleve?.prenom || '');
  const [dateNaissance, setDateNaissance] = useState(eleve?.dateNaissance || '');
  const [classeArabe, setClasseArabe] = useState(eleve?.classeArabe || 0);
  const [classeFrancais, setClasseFrancais] = useState(eleve?.classeFrancais || 0);

  useEffect(() => {
    if (eleve) {
      setNumeroImmatriculation(eleve.numeroImmatriculation);
      setNom(eleve.nom);
      setPrenom(eleve.prenom);
      setDateNaissance(eleve.dateNaissance);
      setClasseArabe(eleve.classeArabe);
      setClasseFrancais(eleve.classeFrancais);
    }
  }, [eleve]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numeroImmatriculation,
      nom,
      prenom,
      dateNaissance,
      classeArabe,
      classeFrancais
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label htmlFor="dateNaissance" className="block text-sm font-medium text-gray-700">
          Date de naissance
        </label>
        <input
          type="date"
          id="dateNaissance"
          value={dateNaissance}
          onChange={(e) => setDateNaissance(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="classeArabe" className="block text-sm font-medium text-gray-700">
          Classe Arabe
        </label>
        <select
          id="classeArabe"
          value={classeArabe}
          onChange={(e) => setClasseArabe(Number(e.target.value))}
          required
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
          value={classeFrancais}
          onChange={(e) => setClasseFrancais(Number(e.target.value))}
          required
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
          {eleve ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default FormulaireEleve;