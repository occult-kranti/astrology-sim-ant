// Selected-claim calculation only. The UI terminates superseded work and checks IDs.
import { buildEschatologyAtlasFrame } from '../core/eschatology-atlas.js';
self.addEventListener('message', ({ data }) => {
  const id = data?.id;
  try {
    if (!data || data.type !== 'frame' || !Number.isSafeInteger(id) || id < 0) {
      throw new TypeError('Expected a frame request with a nonnegative integer ID.');
    }
    self.postMessage({ type: 'frame', id, result: buildEschatologyAtlasFrame(data.request) });
  } catch (error) {
    self.postMessage({ type: 'error', id, message: error instanceof Error ? error.message : 'Calculation failed.' });
  }
});
