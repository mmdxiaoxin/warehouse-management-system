import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Record} from '../models/Record';

export type RecordData = Pick<Record, 'detail' | 'status'>;

export const useRecord = () => {
  const realm = useRealm();
  // 查询所有的 Record 数据
  const records = useQuery(Record);

  // 创建新的 Record
  const createRecord = ({detail, status}: RecordData) => {
    try {
      const newId = new BSON.ObjectId();
      realm.write(() => {
        realm.create(Record.schema.name, {
          _id: newId,
          detail,
          status,
          ctime: new Date(),
          utime: new Date(),
        });
      });
      return newId;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新货物中的某个 Record
  const updateRecord = (id: BSON.ObjectId, record: RecordData) => {
    try {
      realm.write(() => {
        const recordToUpdate = realm.objectForPrimaryKey(Record, id);
        if (recordToUpdate) {
          recordToUpdate.detail = record.detail;
          recordToUpdate.status = record.status;
          recordToUpdate.utime = new Date();
        }
      });
    } catch (error) {
      console.error('更新失败:', error);
      throw error;
    }
  };

  // 删除 Record
  const deleteRecord = (id: BSON.ObjectId) => {
    try {
      realm.write(() => {
        const recordToDelete = realm.objectForPrimaryKey(Record, id);
        if (recordToDelete) {
          realm.delete(recordToDelete);
        }
      });
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  };

  return {
    records,
    createRecord,
    updateRecord,
    deleteRecord,
  };
};
