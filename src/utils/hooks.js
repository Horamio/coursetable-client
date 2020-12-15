import { useState } from "react";
import pluralize from "pluralize";
import update from "immutability-helper";
import { clone } from "./helpers";

class Record {
  // restrict table field names, and add record data as fields : evaluate
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

    Object.keys(this.data).forEach((key) => {
      Record.prototype[key] = this.data[key]; // here is the problem of duplicate data
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

class Table {
  constructor(tableName, database) {
    this.database = database;
    this.tableName = tableName;
    this.data = database[tableName];
    this.all = Object.values(this.data.records).map(
      (recordData) => new Record(recordData, tableName, database)
    );
  }

  where(finder) {
    let filteredRecords = this.all;

    Object.keys(finder).forEach((finderKey) => {
      filteredRecords = filteredRecords.filter(
        (record) => record.data[finderKey] === finder[finderKey]
      );
    });

    return filteredRecords;
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

class JobCollection {
  constructor(database) {
    this.database = clone(database);
    this.jobs = [];
  }

  execute() {
    this.jobs.forEach((job) => {
      const { type, tableName, payload } = job;
      const table = this.database[tableName];
      let tempPayload = clone(payload);

      if (type === "CREATE") {
        let keyValue = tempPayload[table.key];
        this.database = update(this.database, {
          [tableName]: { records: { [keyValue]: { $set: tempPayload } } },
        });
      }

      if (type === "DELETE") {
        let keyValue = tempPayload[table.key];
        this.database = update(this.database, {
          [tableName]: { records: { $unset: [keyValue] } },
        });
      }
    });

    this.jobs = [];
  }

  addJob({ type, tableName, payload }) {
    if (!type || !tableName) return;

    const job = { type, tableName, payload };
    switch (type) {
      case "CREATE":
        this.jobs.push(job);
        break;
      case "DELETE":
        this.jobs.unshift(job);
        break;

      default:
        break;
    }

    return job;
  }
}

export function useRelatedState(entities) {
  const initialDatabase = entitiesToDatabase(entities);
  const [database, setDatabase] = useState(initialDatabase);

  const traverseRecord = (tableName, currentRecord, action = () => {}) => {
    const table = database[tableName];
    if (!table) return;
    const keyValue = currentRecord[table.key];
    if (!keyValue) return;

    table.relations.forEach((relation) => {
      let relationsName = pluralize.plural(relation.tableName);
      let relatedRecords = currentRecord[relationsName];

      if (relatedRecords) {
        relatedRecords.forEach((record) => {
          traverseRecord(relation.tableName, record, action);
        });
      }

      delete currentRecord[relationsName];
    });

    action(currentRecord, tableName);
  };

  const setRecord = (tableName, newRecord) => {
    const jobColletion = new JobCollection(database);
    const action = (currentRecord, tableName) =>
      jobColletion.addJob({
        type: "CREATE",
        tableName,
        payload: currentRecord,
      });
    traverseRecord(tableName, newRecord, action);
    jobColletion.execute();
    setDatabase(jobColletion.database);
  };

  const getTable = (tableName) => {
    if (!tableName) return;
    return new Table(tableName, database);
  };

  const getRecord = (tableName, keyValue) => {
    const table = database[tableName];
    if (!table) return;
    let recordData = table.records[keyValue];
    return new Record(recordData, tableName, database);
  };

  const serialize = (tableName, serializerKey, records) => {
    let table = getTable(tableName);
    if (!table) return;

    let response = [];

    let classRecords = records ? records : table.all;

    classRecords = classRecords.map((classRecord) => {
      if (classRecord.constructor.name !== "Record")
        return new Record(classRecord, tableName, database);
      else return classRecord;
    });

    classRecords.forEach((record) => {
      let recordData = record.data;
      let tableSerializers = table.data.serializers;

      let currentSerializer =
        tableSerializers && tableSerializers[serializerKey]
          ? tableSerializers[serializerKey]
          : (val) => val;

      recordData = currentSerializer(record, serialize);
      console.log({ currentSerializer, recordData });

      response.push(recordData);
    });

    console.log({ response, serializerKey });

    return response;
  };

  const deleteRecord = (tableName, keyValue) => {
    if (!tableName || !keyValue) return;

    const table = database[tableName];
    if (!table) return;
    let selectedRecord = table.records[keyValue];
    if (!selectedRecord) return;

    setDatabase((prevState) => {
      let databaseDup = clone(prevState);
      const tableDup = databaseDup[tableName];
      const recordsDup = tableDup.records;
      delete recordsDup[keyValue];

      return databaseDup;
    });
  };

  return {
    database,
    getRecord,
    setRecord,
    getTable,
    deleteRecord,
    serialize,
  };
}
