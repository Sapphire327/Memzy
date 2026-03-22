export default (date:Date) => {
  const today = new Date()
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  
  const diffInMs = today.getTime() - date.getTime();
  let diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (date.getFullYear() === yesterday.getFullYear() &&
  date.getMonth() === yesterday.getMonth() &&
  date.getDate() === yesterday.getDate()){
    diffInDays = 1
  }

  const diffInMonth =Math.floor(diffInDays/30);
  if (diffInDays >= 365) {
    return 'более года назад';
  }
  if( diffInDays==0)return'Сегодня'
  if (diffInMonth>0){
    let result='месяц'
    if(diffInMonth>1 && diffInMonth<5)
      result+='а'
    else result+='ев'
    return diffInMonth+' '+result+' назад'
  }else{
    let result=''
    if(diffInDays==1 || diffInDays==21)
      result='день'
    else if(diffInDays>1 && diffInDays<=4 || diffInDays>21 && diffInDays<25)
      result='дня'
    else result='дней'
    return diffInDays+' '+result+' назад'
  }
}
