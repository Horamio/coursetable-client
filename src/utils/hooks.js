import { useState } from "react";
import pluralize from "pluralize";

const entitiesToDatabase = (entities) => {
  if (!entities) return {};

  let database = Object.keys(entities).reduce((acum, tableName) => {
    const table = entities[tableName];
    if (!table.key) return acum;
    acum[tableName] = {
      ...table,
      tableName: tableName,
      records: {},
      relations: [],
    };
    return acum;
  }, {});

  Object.values(database).forEach((table) => {
    if (!Array.isArray(table.references)) return;

    table.references.forEach((reference) => {
      if (!reference.tableName || !database[reference.tableName]) return;
      database[reference.tableName].relations.push({
        type: "has_many",
        tableName: table.tableName,
      });
    });
  });

  return database;
};

export function useRelatedState(entities, serializers) {
  const initialDatabase = entitiesToDatabase(entities);
  const [database, setDatabase] = useState(initialDatabase);

  const setRecord = (tableName, newRecord) => {
    let newRecordDup = JSON.parse(JSON.stringify(newRecord));

    const table = database[tableName];
    if (!table) return;

    const keyValue = newRecordDup[table.key];
    if (!keyValue) return;

    table.relations.forEach((relation) => {
      let relationsName = pluralize.plural(relation.tableName);
      let relatedRecords = newRecordDup[relationsName];

      if (relatedRecords) {
        relatedRecords.forEach((record) => {
          setRecord(relation.tableName, record);
        });
        delete newRecordDup[relationsName];
      }
    });

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

    const recordsArray = Object.values(table.records).map((record) => {
      const relations = table.relations;
      const keyName = table.key;

      relations.forEach((relation) => {
        const relatedTableName = relation.tableName;
        const relatedTable = database[relatedTableName];
        const reference = relatedTable.references.find(
          (reference) => reference.tableName === table.tableName
        );
        const referenceKeyName = reference.key;
        const relatedRecords = Object.values(relatedTable.records).filter(
          (relatedRecord) => record[keyName] === relatedRecord[referenceKeyName]
        );

        const pluralRelatedTableName = pluralize.plural(relatedTableName);
        record[pluralRelatedTableName] = relatedRecords;
      });

      return record;
    });
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
