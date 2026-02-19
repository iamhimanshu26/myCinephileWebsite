import axios from 'axios';

const ANILIST_ENDPOINT = 'https://graphql.anilist.co';

const trendingAnimeQuery = `
  query TrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(type: ANIME, sort: TRENDING_DESC, format_in: [TV, TV_SHORT, MOVIE, OVA, ONA]) {
        id
        title { romaji english }
        coverImage { large medium }
        startDate { year }
        format
      }
    }
  }
`;

export const getTrendingAnime = (page = 1, perPage = 20) => axios.post(ANILIST_ENDPOINT, {
  query: trendingAnimeQuery,
  variables: { page, perPage },
}).then((res) => res.data?.data?.Page?.media || []).catch(() => []);

export default { getTrendingAnime };
