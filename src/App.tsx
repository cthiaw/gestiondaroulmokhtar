import React, { useState, useEffect } from 'react';
import { Eleve, Professeur, Classe, Paiement, Depense, User } from './types';
import ListeEleves from './components/ListeEleves';
import ListeProfesseurs from './components/ListeProfesseurs';
import { GestionPaiements } from './components/GestionPaiements';
import { GestionDepenses } from './components/GestionDepenses';
import { TableauBord } from './components/TableauBord';
import { Login } from './components/Login';
import { GestionUtilisateurs } from './components/GestionUtilisateurs';
import { GestionClasses } from './components/GestionClasses';
import { GestionBD } from './components/GestionBD';
import { School, Users, Menu, X } from 'lucide-react';
import { db } from './db/database';

export const App: React.FC = () => {
  const [pageActive, setPageActive] = useState<string>('tableauBord');
  const [user, setUser] = useState<User | null>(null);
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [professeurs, setProfesseurs] = useState<Professeur[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check for saved session
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Ensure database is open
        await db.open();
        
        const loadData = async () => {
          setEleves(await db.eleves.toArray());
          setProfesseurs(await db.professeurs.toArray());
          setClasses(await db.classes.toArray());
          setPaiements(await db.paiements.toArray());
          setDepenses(await db.depenses.toArray());
          setUsers(await db.users.toArray());
        };
        
        await loadData();
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    // Cleanup function to close database connection
    return () => {
      db.close();
    };
  }, []);

  const handleLogin = async (username: string, password: string) => {
    const foundUser = await db.users.where('username').equals(username).first();
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      // Save session
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } else {
      alert('Identifiants incorrects');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const handlePageChange = (page: string) => {
    setPageActive(page);
    setMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const menuItems = [
    { id: 'tableauBord', label: 'Tableau de Bord' },
    { id: 'eleves', label: 'Élèves' },
    { id: 'professeurs', label: 'Professeurs' },
    { id: 'classes', label: 'Classes' },
    { id: 'paiements', label: 'Paiements' },
    { id: 'depenses', label: 'Dépenses' },
    ...(user.role === 'superadmin' ? [
      { id: 'users', label: 'Utilisateurs' },
      { id: 'database', label: 'Base de données' }
    ] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation mobile */}
      <div className="lg:hidden">
        <div className="bg-white shadow-lg px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <School className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold">DAROUL MOKHTAR</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-white">
            <div className="pt-16 pb-6 px-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handlePageChange(item.id)}
                  className={`w-full text-left py-3 px-4 rounded-md mb-2 ${
                    pageActive === item.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-4 border-t pt-4">
                <div className="flex items-center px-4 mb-4">
                  <Users className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-gray-700">{user.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation desktop */}
      <nav className="hidden lg:block bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <School className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold">DAROUL MOKHTAR</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPageActive(item.id)}
                    className={`${
                      pageActive === item.id
                        ? 'border-indigo-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-gray-400" />
                <span className="ml-2 text-gray-700">{user.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {pageActive === 'tableauBord' && (
            <TableauBord 
              paiements={paiements} 
              depenses={depenses} 
              eleves={eleves} 
              classes={classes}
              professeurs={professeurs}
            />
          )}
          {pageActive === 'eleves' && (
            <ListeEleves 
              eleves={eleves}
              classes={classes}
              onAddEleve={async (eleve) => {
                const id = await db.eleves.add(eleve);
                setEleves([...eleves, { ...eleve, id }]);
              }}
              onUpdateEleve={async (id, eleve) => {
                await db.eleves.update(id, eleve);
                setEleves(eleves.map(e => e.id === id ? { ...eleve, id } : e));
              }}
              onDeleteEleve={async (id) => {
                await db.eleves.delete(id);
                setEleves(eleves.filter(e => e.id !== id));
              }}
            />
          )}
          {pageActive === 'professeurs' && (
            <ListeProfesseurs 
              professeurs={professeurs}
              classes={classes}
              onAddProfesseur={async (professeur) => {
                const id = await db.professeurs.add(professeur);
                setProfesseurs([...professeurs, { ...professeur, id }]);
              }}
              onUpdateProfesseur={async (id, professeur) => {
                await db.professeurs.update(id, professeur);
                setProfesseurs(professeurs.map(p => p.id === id ? { ...professeur, id } : p));
              }}
              onDeleteProfesseur={async (id) => {
                await db.professeurs.delete(id);
                setProfesseurs(professeurs.filter(p => p.id !== id));
              }}
            />
          )}
          {pageActive === 'classes' && (
            <GestionClasses 
              classes={classes}
              eleves={eleves}
              professeurs={professeurs}
              onAddClasse={async (classe) => {
                const id = await db.classes.add(classe);
                setClasses([...classes, { ...classe, id }]);
              }}
              onUpdateClasse={async (id, classe) => {
                await db.classes.update(id, classe);
                setClasses(classes.map(c => c.id === id ? { ...c, ...classe } : c));
              }}
              onDeleteClasse={async (id) => {
                await db.classes.delete(id);
                setClasses(classes.filter(c => c.id !== id));
              }}
              onAddEleveToClasse={async (classeId, eleveId) => {
                const eleve = eleves.find(e => e.id === eleveId);
                if (eleve) {
                  await db.eleves.update(eleveId, { ...eleve, classeId });
                  setEleves(eleves.map(e => e.id === eleveId ? { ...e, classeId } : e));
                }
              }}
              onAssignProfesseurToClasse={async (classeId, professeurId) => {
                const professeur = professeurs.find(p => p.id === professeurId);
                if (professeur) {
                  await db.professeurs.update(professeurId, { ...professeur, classeId });
                  setProfesseurs(professeurs.map(p => p.id === professeurId ? { ...p, classeId } : p));
                }
              }}
            />
          )}
          {pageActive === 'paiements' && (
            <GestionPaiements 
              eleves={eleves}
              paiements={paiements}
              ajouterPaiement={async (eleveId, paiement) => {
                const id = await db.paiements.add({ ...paiement, eleveId });
                setPaiements([...paiements, { ...paiement, id, eleveId }]);
              }}
            />
          )}
          {pageActive === 'depenses' && (
            <GestionDepenses 
              depenses={depenses}
              users={users}
              currentUser={user}
              professeurs={professeurs}
              ajouterDepense={async (depense) => {
                const id = await db.depenses.add(depense);
                setDepenses([...depenses, { ...depense, id }]);
              }}
            />
          )}
          {pageActive === 'users' && user.role === 'superadmin' && (
            <GestionUtilisateurs 
              users={users}
              onAddUser={async (newUser) => {
                const id = await db.users.add(newUser);
                setUsers([...users, { ...newUser, id }]);
              }}
              onUpdateUser={async (id, updatedUser) => {
                await db.users.update(id, updatedUser);
                setUsers(users.map(u => u.id === id ? { ...u, ...updatedUser } : u));
              }}
              onDeleteUser={async (id) => {
                await db.users.delete(id);
                setUsers(users.filter(u => u.id !== id));
              }}
            />
          )}
          {pageActive === 'database' && user.role === 'superadmin' && (
            <GestionBD />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;