// {
//     "index": 0,
//     "code": 11000,
//     "keyPattern": {
//     "email": 1
// },
//     "keyValue": {
//     "email": "test@gmail.com"
// }
// }
export const MongodbExceptionCodes = {
  '11000': (e, key) => {
    return `${e.keyValue[key]} already exists`;
  },
};
