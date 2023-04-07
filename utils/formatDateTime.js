import dayjs from 'dayjs';

export function convertUTCToLocal(value, offset, format = 'YYYY-MM-DD HH:mm') {
  return dayjs.utc(value).utcOffset(offset).format(format);
}
