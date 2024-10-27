import React, { useState, useEffect } from 'react';
import { db } from '../db/database';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export const GestionBD: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const tableNames = Object.keys(db).filter(key => typeof db[key as keyof typeof db] === 'object' && 'toArray' in db[key as keyof typeof db]);
    setTables(tableNames);
  }, []);

  const loadTableData = async (tableName: string) => {
    setSelectedTable(tableName);
    const data = await (db as any)[tableName].toArray();
    setTableData(data);
  };

  const renderTableData = () => {
    if (!tableData.length) return null;

    const columns = Object.keys(tableData[0]);

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(column => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.map((row, index) => (
            <TableRow key={index}>
              {columns.map(column => (
                <TableCell key={column}>{JSON.stringify(row[column])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion de la Base de Données</h2>
      <div className="flex space-x-4">
        {tables.map(table => (
          <button
            key={table}
            onClick={() => loadTableData(table)}
            className={`px-4 py-2 rounded ${selectedTable === table ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {table}
          </button>
        ))}
      </div>
      {selectedTable && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Table: {selectedTable}</h3>
          {renderTableData()}
        </div>
      )}
    </div>
  );
};

export default GestionBD;