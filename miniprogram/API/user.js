const { CLOUD, DB } = require('./request');
const Request = require('./request');

class UserModel extends Request {
  async getUserByOpenid() {
    const result = await DB.collection('user')
      .where({ _openid: await this.getopenid() })
      .get();
    return result.data;
  }
  async getUserInfo(id) {
    const { result } = await CLOUD.callFunction({
      name: 'getuserinfo',
      data: {
        info: CLOUD.CloudID(id),
      },
    });
    return result;
  }
  async addUserInfo(e) {
    const { avatarUrl, nickName } = await this.getUserInfo(e.detail.cloudID);
    try {
      const { _id: id } = await DB.collection('user').add({
        data: {
          avatar: avatarUrl,
          name: nickName,
        },
      });
      return id;
    } catch (error) {
      wx.showToast({
        title: '新增失败',
        icon: 'none',
      });
    }
  }
  async bindPhone(e) {
    const { phoneNumber } = await this.getUserInfo(e.detail.cloudID);
    try {
      await DB.collection('user')
        .where({
          _openid: await this.getopenid(),
        })
        .update({
          data: {
            phone: phoneNumber,
          },
        });
      console.log(phoneNumber);
      return phoneNumber;
    } catch (error) {
      console.log(error);
      wx.showToast({
        title: '新增失败',
        icon: 'none',
      });
    }
  }
}
module.exports = UserModel;
