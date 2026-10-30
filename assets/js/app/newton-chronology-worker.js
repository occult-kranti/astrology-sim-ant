// One explicitly requested computation per worker. The UI terminates obsolete
// workers and checks the request ID before displaying or exporting a response.
import { buildNewtonExplorationFrame, buildNewtonYearSurvey } from '../core/newton-chronology.js';

self.addEventListener('message', ({ data }) => {
  const id = data?.id;
  try {
    if (!data || !Number.isSafeInteger(id) || id < 0 || !['frame', 'survey'].includes(data.type)) {
      throw new TypeError('Expected a frame or survey request with a nonnegative integer ID.');
    }
    const result = data.type === 'frame'
      ? buildNewtonExplorationFrame(data.request)
      : buildNewtonYearSurvey(data.request);
    self.postMessage({ type: data.type, id, result });
  } catch (error) {
    self.postMessage({ type: 'error', id, message: error instanceof Error ? error.message : 'Calculation failed.' });
  }
});
