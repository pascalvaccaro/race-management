export default ({ env }) => ({
  url: env('PUBLIC_URL', 'http://localhost:1337')
});
