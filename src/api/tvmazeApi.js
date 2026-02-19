import axios from 'axios';

const TVMAZE_BASE = 'https://api.tvmaze.com';

const tvmazeClient = axios.create({
  baseURL: TVMAZE_BASE,
});

export const getSchedule = (country = 'US', date = null, embedShow = true) => {
  const params = { country };
  if (date) params.date = date;
  if (embedShow) params.embed = 'show';
  return tvmazeClient.get('/schedule', { params }).then((res) => res.data);
};

export const getScheduleWeb = () => tvmazeClient.get('/schedule/web').then((res) => res.data);

export default tvmazeClient;
