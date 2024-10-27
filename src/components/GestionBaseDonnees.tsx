import React, { useState } from 'react';
import { db } from '../db/database';

const GestionBaseDonnees: React.FC = () => {
  const [message, setMessage] = useState<string>('');

  const handleExport = async () => {
    try {
      const data = {
        eleves: await db.eleves.toArray(),
        professeurs: await db.professeurs.toArray(),
        classes: await db.classes.toArray(),
        paiements: await db.paiements.toArray(),
        depenses: await db.depenses.toArray(),
        users: await db.users.toArray(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'daroul_mokhtar_db_export.json';
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Export réussi !');
    } catch (error) {
      console.error('Erreur lors de l\'export :', error);
      setMessage('Erreur lors de l\'export. Veuillez réessayer.');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        
        await db.transaction('rw', db.eleves, db.professeurs, db.classes, db.paiements, db.depenses, db.users, async () => {
          await db.eleves.clear();
          await db.professeurs.clear();
          await db.classes.clear();
          await db.paiements.clear();
          await db.depenses.clear();
          await db.users.clear();

          await db.eleves.bulkAdd(data.eleves);
          await db.professeurs.bulkAdd(data.professeurs);
          await db.classes.bulkAdd(data.classes);
          await db.paiements.bulkAdd(data.paiements);
          await db.depenses.bulkAdd(data.depenses);
          await db.users.bulkAdd(data.users);
        });

        setMessage('Import réussi !');
      } catch (error) {
        console.error('Erreur lors de l\'import :', error);
        setMessage('Erreur lors de l\'import. Veuillez vérifier le fichier et réessayer.');
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Gestion de la Base de Données</h2>
      <div className="flex space-x-4">
        <button
          onClick={handleExport}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Exporter la base de données
        </button>
        <label className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          Importer la base de données
          <input
            type="file"
            onChange={handleImport}
            accept=".json"
            className="hidden"
          />
        </label>
      </div>
      {message && <p className="text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default GestionBaseDonnees;