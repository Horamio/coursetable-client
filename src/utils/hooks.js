import { useState } from "react";

const entitiesToDatabase = (entities) => {
  if (!entities) return {};

  return Object.keys(entities).reduce((acum, tableName) => {
    const table = entities[tableName];
    if (!table.key) return acum;
    acum[tableName] = { ...table, tableName: tableName, records: {} };
    return acum;
  }, {});
};

export function useRelatedState(entities, serializers) {
  const initialDatabase = entitiesToDatabase(entities);
  const [database, setDatabase] = useState(initialDatabase);

  const setRecord = (tableName, newRecord) => {
    const table = database[tableName];
    if (!table) return;

    const keyValue = newRecord[table.key];
    if (!keyValue) return;

    let selectedRecord = table.records[keyValue] || {};

    setDatabase((prevState) => {
      let databaseDup = JSON.parse(JSON.stringify(prevState));
      return {
        ...databaseDup,
        [tableName]: {
          ...table,
          records: {
            ...table.records,
            [keyValue]: {
              ...selectedRecord,
              ...newRecord,
            },
          },
        },
      };
    });
  };

  const getRecord = (tableName, keyValue) => {
    const table = database[tableName];
    if (!table) return;

    return table.records[keyValue];
  };
  const serialize = (tableName, serializerKey) => {
    const table = database[tableName];
    if (!table) return;

    const recordsArray = Object.values(table.records);
    return recordsArray;
  };

  const deleteRecord = (tableName, keyValue) => {
    if (!tableName || !keyValue) return;

    const table = database[tableName];
    if (!table) return;
    let selectedRecord = table.records[keyValue];
    if (!selectedRecord) return;

    setDatabase((prevState) => {
      let databaseDup = JSON.parse(JSON.stringify(prevState));
      const tableDup = databaseDup[tableName];
      const recordsDup = tableDup.records;
      delete recordsDup[keyValue];

      return databaseDup;
    });
  };

  return { database, getRecord, setRecord, deleteRecord, serialize };
}
