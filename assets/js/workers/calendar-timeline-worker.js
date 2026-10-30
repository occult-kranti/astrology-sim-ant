import { buildCalendarTimelineGrid, buildCalendarTimelineFrame, exportCalendarTimelineJSON, exportCalendarTimelineCSV } from '../core/calendar-timeline.js';
// One worker is owned by one UI request. The UI terminates it on replacement or
// cancellation, so a synchronous calculation cannot lock the date controls.
self.onmessage = ({ data }) => {
  const { requestId, type, request, index } = data || {};
  try {
    const methods = { grid: buildCalendarTimelineGrid, frame: buildCalendarTimelineFrame, json: exportCalendarTimelineJSON, csv: exportCalendarTimelineCSV };
    if (!Object.hasOwn(methods, type)) throw new RangeError('Unknown timeline operation.');
    const result = methods[type](request, index);
    self.postMessage({ requestId, type, result });
  } catch (error) {
    self.postMessage({ requestId, type, error: { name: error.name, message: error.message || 'The calculation could not finish.' } });
  }
};
