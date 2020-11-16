import { useState } from "react";
import pluralize from "pluralize";

class Record {
  constructor(recordData, tableName, database) {
    this.database = database;
    this.tableName = tableName;
    this.table = this.database[this.tableName];
    this.relations = this.table.relations;
    this.data = recordData;

    this.relations.forEach((relation) => {
      const relationTableName = pluralize.plural(relation.tableName);
      Record.prototype[relationTableName] = this.getSubRecords(
        relation.tableName
      );
    });
  }

  relation(subTableName) {
    return this.relations.find(
      (relation) => relation.tableName === subTableName
    );
  }

  getSubRecords(subTableName) {
    let relation = this.relation(subTableName);

    if (!relation) return;

    let subTable = this.database[subTableName];
    let reference = subTable.references.find(
      (reference) => reference.tableName === this.table.tableName
    );

    if (!reference) return;
    let tableKey = this.table.key;

    let subRecords = Object.values(subTable.records).filter(
      (record) => record[reference.key] === this.data[tableKey]
    );

    return subRecords.map(
      (subRecord) => new Record(subRecord, subTableName, this.database)
    );
  }
}

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

  const injectRecord = (tableName, newRecord, tempDatabase) => {
    let newRecordDup = JSON.parse(JSON.stringify(newRecord));
    let databaseDup = JSON.parse(JSON.stringify(tempDatabase));

    const table = databaseDup[tableName];
    if (!table) return tempDatabase;
    const keyValue = newRecordDup[table.key];
    if (!keyValue) return tempDatabase;

    table.relations.forEach((relation) => {
      let relationsName = pluralize.plural(relation.tableName);
      let relatedRecords = newRecordDup[relationsName];

      if (relatedRecords) {
        relatedRecords.forEach((record) => {
          databaseDup = injectRecord(relation.tableName, record, databaseDup);
        });
        delete newRecordDup[relationsName];
      }
    });

    let selectedRecord = table.records[keyValue] || {};

    return {
      ...databaseDup,
      [tableName]: {
        ...table,
        records: {
          ...table.records,
          [keyValue]: {
            ...selectedRecord,
            ...newRecordDup,
          },
        },
      },
    };
  };

  const setRecord = (tableName, newRecord) => {
    setDatabase((prevState) => {
      return injectRecord(tableName, newRecord, prevState);
    });
  };

  const getRecord = (tableName, keyValue) => {
    const table = database[tableName];
    if (!table) return;
    let recordData = table.records[keyValue];
    return new Record(recordData, tableName, database);
  };

  const serialize = (tableName, serializerKey) => {
    let databaseDup = JSON.parse(JSON.stringify(database));
    const table = databaseDup[tableName];
    if (!table) return;

    const recordsArray = Object.values(table.records).map((record) => {
      const relations = table.relations;
      const keyName = table.key;

      relations.forEach((relation) => {
        const relatedTableName = relation.tableName;
        const relatedTable = databaseDup[relatedTableName];
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
