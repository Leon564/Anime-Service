const snapshotToArray = async (snapshot: any) => {
  let returnArr: any[] = [];

  snapshot.forEach(function (childSnapshot: any) {
    var item = childSnapshot.val();
    item.key = childSnapshot.key;

    returnArr.push(item);
  });

  return returnArr;
};

export default snapshotToArray;
