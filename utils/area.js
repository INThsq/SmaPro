var AreaJson = ['鞋履', '服饰', '家居', '护肤','电子'];
/**
 * 获取所有省份
 */
function getProvinces(){
  var provinces = [];
  for (var i = 0; i < AreaJson.length;i++){
    provinces.push(AreaJson[i]);
  }
  return provinces;
}


module.exports = {
  getProvinces: getProvinces,
}



