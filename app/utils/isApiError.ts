
// export default function (e:unknown):e is NuxtError & {data:string[]} {
//   return isNuxtError(e) && Array.isArray(e.data) && e.data.every(item => typeof item === 'string');
// }
export  default function(error: unknown): error is {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  data?:string[];
} {
  return (
    error !== null &&
    typeof error === 'object' &&
    error !== undefined &&
    ('statusCode' in error && 'statusMessage' in error && 'message' in error && 'data' in error)&&
    (typeof error.statusCode==='undefined' || typeof error.statusCode === 'number')&&
    (typeof error.statusMessage==='undefined' || typeof error.statusMessage === 'string')&&
    (typeof error.message==='undefined' || typeof error.message === 'string')&&
    (typeof error.data==='undefined' || (Array.isArray(error.data) && error.data.every(item => typeof item === 'string')))
)}