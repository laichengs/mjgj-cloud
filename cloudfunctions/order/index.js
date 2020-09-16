// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const _ = cloud.database().command;
  const result = await cloud
    .database()
    .collection('order')
    .aggregate()
    .match({
      status: event.status == 0 ? _.neq(event.status) : event.status,
    })
    .sort({
      createTime: -1,
    })
    .skip((event.page - 1) * event.limit)
    .limit(event.limit)
    .lookup({
      from: 'item',
      localField: 'item_id',
      foreignField: 'id',
      as: 'item',
    })
    .end();
  return result.list;
};
