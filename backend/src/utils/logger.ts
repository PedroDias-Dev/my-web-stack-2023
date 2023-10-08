import moment from 'moment';

export const log = (type = 'INFO', ...args: any[]) => {
  console.log(`[${moment(new Date()).format('YYYY-MM-DD HH:mm:ss:SSS')}] ${type}:`, ...args);
};
