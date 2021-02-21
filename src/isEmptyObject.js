export default (obj) => obj !== null && typeof obj === 'object' && !Object.keys(obj).length;
