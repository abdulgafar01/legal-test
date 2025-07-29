// @/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://ec2-40-172-8-211.me-central-1.compute.amazonaws.com/api',
  withCredentials: true,
});

export default instance;
