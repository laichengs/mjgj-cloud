function createSerialNo(){
    let num = Math.floor((Math.random()+1)*1000000).toString(16).toUpperCase()
    let time = new Date().getMilliseconds();
    return num+""+time.toString()
}
module.exports = {
  createSerialNo
}