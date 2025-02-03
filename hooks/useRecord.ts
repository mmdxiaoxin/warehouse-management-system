import {useQuery, useRealm} from '@realm/react';
import {BSON} from 'realm';
import {Record} from '../models/Record';

export type RecordData = Pick<Record, 'detail' | 'status' | 'type'>;

// 使用 Realm 数据模型
export const useRecord = () => {
  const realm = useRealm();
  const records = useQuery(Record); // 查询所有的 Record 数据

  // 创建新的 Record
  const createRecord = ({detail, status, type}: RecordData) => {
    try {
      const newId = new BSON.ObjectId();
      const newRecord = {
        _id: newId,
        detail,
        status,
        type,
        ctime: new Date(),
        utime: new Date(),
      };

      realm.write(() => {
        realm.create(Record.schema.name, newRecord);
      });

      // 返回完整的 Record 对象
      return newRecord;
    } catch (error) {
      console.error('创建失败:', error);
      return null;
    }
  };

  // 更新货物中的某个 Record
  const updateRecord = (id: BSON.ObjectId, recordData: RecordData) => {
    try {
      realm.write(() => {
        const recordToUpdate = realm.objectForPrimaryKey(Record, id);
        if (recordToUpdate) {
          // 更新 record
          recordToUpdate.type = recordData.type;
          recordToUpdate.detail = recordData.detail;
          recordToUpdate.status = recordData.status;
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

  // 获取指定类型的记录（例如：`inbound`、`outbound` 等）
  const getRecordsByType = (type: 'inbound' | 'outbound' | 'transfer') => {
    return records.filtered(`type == "${type}"`).sorted('ctime', true);
  };

  // 获取指定状态的记录（例如：已完成或未完成的记录）
  const getRecordsByStatus = (status: boolean) => {
    return records.filtered(`status == ${status}`).sorted('ctime', true);
  };

  // 获取指定类型和状态的记录
  const getRecordsByTypeAndStatus = (
    type: 'inbound' | 'outbound' | 'transfer',
    status: boolean,
  ) => {
    return records
      .filtered(`type == "${type}" AND status == ${status}`)
      .sorted('ctime', true);
  };

  return {
    records,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByType,
    getRecordsByStatus,
    getRecordsByTypeAndStatus,
  };
};
