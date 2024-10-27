import React, { useState } from 'react';
import { Eleve, Paiement } from '../types';
import RecuPaiement from './RecuPaiement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export const GestionPaiements: React.FC<{
  eleves: Eleve[];
  paiements: Paiement[];
  ajouterPaiement: (eleveId: number, paiement: Omit<Paiement, 'id'>) => void;
}> = ({ eleves, paiements, ajouterPaiement }) => {
  const [eleveSelectionne, setEleveSelectionne] = useState<number | ''>('');
  const [typePaiement, setTypePaiement] = useState<'Inscription' | 'Mensualité' | 'Tenue'>('Inscription');
  const [montant, setMontant] = useState<number>(0);
  const [mois, setMois] = useState<string>('');
  const [recuPaiement, setRecuPaiement] = useState<Paiement | null>(null);
  const [showAllRecus, setShowAllRecus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (eleveSelectionne !== '') {
      const nouvellePaiement: Omit<Paiement, 'id'> = {
        eleveId: Number(eleveSelectionne),
        date: new Date().toISOString().split('T')[0],
        montant,
        type: typePaiement,
        mois: typePaiement === 'Mensualité' ? mois : undefined
      };
      ajouterPaiement(Number(eleveSelectionne), nouvellePaiement);
      
      // Générer le reçu de paiement
      setRecuPaiement({ ...nouvellePaiement, id: Date.now() });

      // Réinitialiser le formulaire
      setEleveSelectionne('');
      setTypePaiement('Inscription');
      setMontant(0);
      setMois('');
    }
  };

  const handlePrint = (paiement: Paiement) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const eleve = eleves.find(e => e.id === paiement.eleveId);
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de Paiement - DAROUL MOKHTAR</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { margin-bottom: 20px; }
              .footer { margin-top: 50px; text-align: center; }
              .signature { margin-top: 100px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>DAROUL MOKHTAR</h1>
              <h2>Reçu de Paiement</h2>
            </div>
            <div class="content">
              <p><strong>Date:</strong> ${new Date(paiement.date).toLocaleDateString()}</p>
              <p><strong>Élève:</strong> ${eleve ? `${eleve.nom} ${eleve.prenom}` : 'Non spécifié'}</p>
              <p><strong>Type de paiement:</strong> ${paiement.type}</p>
              ${paiement.type === 'Mensualité' && paiement.mois ? 
                `<p><strong>Mois:</strong> ${new Date(paiement.mois + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</p>` 
                : ''}
              <p><strong>Montant:</strong> ${paiement.montant} FCFA</p>
            </div>
            <div class="footer">
              <div class="signature">
                <p>Signature et Cachet</p>
                <p>_____________________</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des Paiements</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label htmlFor="eleve" className="block text-sm font-medium text-gray-700">
            Élève
          </label>
          <select
            id="eleve"
            value={eleveSelectionne}
            onChange={(e) => setEleveSelectionne(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Sélectionnez un élève</option>
            {eleves.map((eleve) => (
              <option key={eleve.id} value={eleve.id}>
                {eleve.nom} {eleve.prenom} - {eleve.numeroImmatriculation}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="typePaiement" className="block text-sm font-medium text-gray-700">
            Type de paiement
          </label>
          <select
            id="typePaiement"
            value={typePaiement}
            onChange={(e) => setTypePaiement(e.target.value as 'Inscription' | 'Mensualité' | 'Tenue')}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="Inscription">Inscription</option>
            <option value="Mensualité">Mensualité</option>
            <option value="Tenue">Tenue</option>
          </select>
        </div>

        {typePaiement === 'Mensualité' && (
          <div>
            <label htmlFor="mois" className="block text-sm font-medium text-gray-700">
              Mois
            </label>
            <input
              type="month"
              id="mois"
              value={mois}
              onChange={(e) => setMois(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        )}

        <div>
          <label htmlFor="montant" className="block text-sm font-medium text-gray-700">
            Montant
          </label>
          <input
            type="number"
            id="montant"
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Enregistrer le paiement
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Historique des Paiements</h3>
          <button
            onClick={() => setShowAllRecus(!showAllRecus)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            {showAllRecus ? 'Masquer les reçus' : 'Voir tous les reçus'}
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Élève</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Mois</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paiements.map((paiement) => {
              const eleve = eleves.find(e => e.id === paiement.eleveId);
              return (
                <TableRow key={paiement.id}>
                  <TableCell>{new Date(paiement.date).toLocaleDateString()}</TableCell>
                  <TableCell>{eleve ? `${eleve.nom} ${eleve.prenom}` : 'Élève inconnu'}</TableCell>
                  <TableCell>{paiement.type}</TableCell>
                  <TableCell>
                    {paiement.mois ? 
                      new Date(paiement.mois + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }) 
                      : '-'}
                  </TableCell>
                  <TableCell>{paiement.montant} FCFA</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handlePrint(paiement)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Imprimer le reçu
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {recuPaiement && (
        <RecuPaiement
          paiement={recuPaiement}
          eleve={eleves.find(e => e.id === recuPaiement.eleveId)}
          onClose={() => setRecuPaiement(null)}
        />
      )}

      {showAllRecus && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tous les Reçus</h3>
              <button
                onClick={() => setShowAllRecus(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paiements.map((paiement) => {
                const eleve = eleves.find(e => e.id === paiement.eleveId);
                return (
                  <div key={paiement.id} className="border p-4 rounded-lg">
                    <h4 className="font-bold mb-2">
                      {eleve ? `${eleve.nom} ${eleve.prenom}` : 'Élève inconnu'}
                    </h4>
                    <p>Date: {new Date(paiement.date).toLocaleDateString()}</p>
                    <p>Type: {paiement.type}</p>
                    {paiement.mois && (
                      <p>Mois: {new Date(paiement.mois + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    )}
                    <p>Montant: {paiement.montant} FCFA</p>
                    <button
                      onClick={() => handlePrint(paiement)}
                      className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Imprimer
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionPaiements;