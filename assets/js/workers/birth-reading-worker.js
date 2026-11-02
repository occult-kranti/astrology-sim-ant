import { buildBirthReading } from '../core/birth-reading.js';
self.onmessage = ({data}) => {
  try { self.postMessage({report:buildBirthReading(data)}); }
  catch(error) { self.postMessage({error:error.message}); }
};
