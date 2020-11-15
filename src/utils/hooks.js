import { useState, useEffect } from "react";

const statesToRecords = (states, foreignKeyLabel) => {
  if (!Array.isArray(states)) return {};

  return states.reduce((acum, state) => {
    const foreignKey = state[foreignKeyLabel];
    acum[foreignKey] = state;
    return acum;
  }, {});
};

export function useRelatedState(initialState, foreignKeyLabel, serializers) {
  const initialRecords = statesToRecords(initialState, foreignKeyLabel);
  const [records, setRecords] = useState(initialRecords);

  const setRecord = (newRecord) => {
    const foreignKey = newRecord[foreignKeyLabel];
    if (!foreignKey) return;

    let selectedRecord = records[foreignKey] || {};

    setRecords((prevState) => {
      let recordsDup = JSON.parse(JSON.stringify(prevState));
      return {
        ...recordsDup,
        [foreignKey]: {
          ...selectedRecord,
          ...newRecord,
        },
      };
    });
  };

  const getRecord = (foreignKey) => records[foreignKey];
  const serialize = (serializerKey) => {
    const recordsArray = Object.values(records);
    return recordsArray;
  };

  const deleteRecord = (foreignKey) => {
    if (!foreignKey) return;
    let selectedRecord = records[foreignKey];
    if (!selectedRecord) return;

    setRecords((prevState) => {
      let recordsDup = JSON.parse(JSON.stringify(prevState));
      delete recordsDup[foreignKey];
      return recordsDup;
    });
  };

  return { records, getRecord, setRecord, deleteRecord, serialize };
}
